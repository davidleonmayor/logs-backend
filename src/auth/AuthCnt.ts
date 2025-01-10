import type { Request, Response } from "express";
import Companie from "../../db/models/Companie";
import { logger } from "../common/logger/logger";
import { AuthEmail } from "../../emails/AuthEmail";
import { generateToken } from "./utils/token";
import { hashPassword } from "./utils/auth";
import { checkPassword } from "./utils/auth";
import { generateJWT } from "./utils/jwt";

export class AuthCnt {
  static async create(req: Request, res: Response) {
    const { body } = req;
    logger.info("Creating a new company", { body });

    try {
      // Check if the company already exists based on name
      const companieExists = await Companie.findOne({
        where: { name: body.name },
      });
      if (companieExists) {
        res.status(400).json({ error: "Companie name already exists" });
        return;
      }

      // Create a new companie entry in the database
      const companie = await Companie.create(body);
      companie.password = await hashPassword(body.password);
      const token = generateToken();
      companie.token = token;

      if (process.env.NODE_ENV !== "production") {
        globalThis.cashTrackrConfirmationToken = token;
      }

      await companie.save();
      logger.info("Company created successfully", { companie });

      // Send confirmation email
      await AuthEmail.sendConfirmationEmail({
        name: companie.name,
        email: companie.email,
        token: companie.token,
      });
      logger.info("Email send successfully", { email: companie.email });

      res.status(201).json({
        msg: "Companie created successfully, now verify your! Check your email...",
      });
    } catch (error) {
      logger.error("Error creating company", { error: error.message });
      res
        .status(500)
        .json({ error: "There was an error creating the companie" });
    }
  }

  static async confirmAccount(req: Request, res: Response) {
    const { token } = req.body;

    try {
      // Check if the token is valid
      const companieWithTokenExist = await Companie.findOne({
        where: { token: token },
      });
      if (!companieWithTokenExist) {
        res.status(400).json({ error: "Invalid token" });
        return;
      }

      // Update the company status
      await companieWithTokenExist.update({ token: "active" });
      logger.info("Company account confirmed successfully", {
        companie: companieWithTokenExist,
      });

      res.status(200).json({ msg: "Account confirmed successfully" });
    } catch (error) {
      logger.error("Error confirming account", { error: error.message });
      res
        .status(500)
        .json({ error: "There was an error confirming the account" });
    }
  }

  static async login(req: Request, res: Response) {
    const { body } = req;

    try {
      // Check credentials
      const companie = await Companie.findOne({
        where: { email: body.email },
      });
      if (!companie) {
        logger.error("Companie not with email", { email: body.email });
        res.status(404).json({ error: "E-mail not found" });
        return;
      }
      if (companie.token !== "active") {
        logger.error("Companie unactive");
        res.status(401).json({ error: "Unactive account" });
        return;
      }
      const isPasswordCorrect = await checkPassword(
        body.password,
        companie.password
      );
      if (!isPasswordCorrect) {
        res.status(400).json({ error: "Invalid password" });
        return;
      }

      // Generate token
      const token = generateJWT({
        id: companie?.id,
        email: companie?.email,
      });

      const { password, ...companieData } = companie.toJSON();
      logger.info("Company logged in successfully", { companieData });
      res.status(200).json({ token });
    } catch (error) {
      logger.error("Error logging in company", { error: error.message });
      res
        .status(500)
        .json({ error: "There was an error logging in the companie" });
    }
  }

  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    // Revisar que el usuario exista
    const companie = await Companie.findOne({ where: { email } });
    if (!companie) {
      const error = new Error("Usuario no encontrado");
      res.status(404).json({ error: error.message });
      return;
    }
    if (companie.token !== "active") {
      res.status(401).json({ error: "Unactive account" });
      return;
    }

    companie.token = generateToken();
    await companie.save();

    await AuthEmail.sendPasswordResetToken({
      name: companie.name,
      email: companie.email,
      token: companie.token,
    });

    res.json("Revisa tu email para instrucciones");
  };

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Revisar que el password y confirmPassword sean iguales
    if (password !== confirmPassword) {
      const error = new Error("Las contraseñas no coinciden");
      res.status(400).json({ error: error.message });
      return;
    }

    // Revisar que el token sea válido
    const companie = await Companie.findOne({ where: { token } });
    if (!companie) {
      const error = new Error("Token no válido");
      res.status(404).json({ error: error.message });
      return;
    }

    // Asignar el nuevo password
    companie.password = await hashPassword(password);
    companie.token = "active";
    await companie.save();

    res.json("El password se modificó correctamente");
  };
}
