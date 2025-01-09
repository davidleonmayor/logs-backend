import type { Request, Response } from "express";
import Companie from "../../db/models/Companie";
import { logger } from "../commons/logger/logger";
import { AuthEmail } from "../../emails/AuthEmail";
import { generateToken } from "./utils/token";
import { hashPassword } from "./utils/auth";

export class CompanieCnt {
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

  static async getOne(req: Request, res: Response) {
    const { companieName } = req.params;
    logger.info("Getting company by id", { companieName });

    try {
      const companieExist = await Companie.findOne({
        where: { name: companieName },
      });
      if (!companieExist) {
        res.status(404).json({ error: "Companie not found" });
        return;
      }
      logger.info("Company found", { companieExist });

      const { password, token, ...companie } = companieExist.toJSON();
      res.status(200).json({ companie });
    } catch (error) {
      logger.error("Error getting company", { error: error.message });
      res
        .status(500)
        .json({ error: "There was an error getting the companie" });
    }
  }

  static async remove(req: Request, res: Response) {
    const { companieName } = req.params;

    try {
      const companie = await Companie.findOne({
        where: { name: companieName },
      });
      if (!companie) {
        res.status(404).json({ error: "Companie not found" });
        return;
      }

      await companie.destroy();
      logger.info("Company deleted successfully", { companie });
      res.status(200).json({ msg: "Companie deleted successfully" });
    } catch (error) {
      logger.error("Error deleting company", { error: error.message });
      res
        .status(500)
        .json({ error: "There was an error deleting the companie" });
    }
  }

  static async update(req: Request, res: Response) {
    const { body, authCompanie } = req;

    try {
      // check if the company already exists based on name
      const companieExists = await Companie.findOne({
        where: { name: body.name },
      });
      if (companieExists) {
        res.status(400).json({ error: "Companie name already exists" });
        return;
      }

      await authCompanie.update(body);
      logger.info("Company updated successfully", { companie: authCompanie });
      res.status(200).json({ msg: "Companie updated successfully" });
    } catch (error) {
      logger.error("Error updating company", { error: error.message });
      res
        .status(500)
        .json({ error: "There was an error updating the companie" });
    }
  }
}
