import type { Request, Response } from "express";
import Companie from "../../db/models/Companie";
import { logger } from "../commons/logger/logger";
import { AuthEmail } from "../../emails/AuthEmail";
import { generateToken } from "./utils/token";

export class CompanieCnt {
  static async create(req: Request, res: Response) {
    const { name, address, phone, email } = req.body;
    logger.info("Creating a new company", { name, address, phone, email });

    try {
      // Check if the company already exists based on name
      const companieExists = await Companie.findOne({ where: { name } });
      if (companieExists) {
        res.status(400).json({ error: "Companie name already exists" });
        return;
      }

      // Create a new companie entry in the database
      const token = generateToken();
      const companie = await Companie.create({
        name,
        address,
        phone,
        email,
        token,
      });
      logger.info("Company created successfully", { companie });

      // Send confirmation email
      await AuthEmail.sendConfirmationEmail({ name, email, token });
      logger.info("Email send successfully", { email });

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
    const { companieId } = req.params;
    logger.info("Getting company by id", { companieId });

    try {
      const companieExist = await Companie.findOne({
        where: { name: companieId },
      });
      if (!companieExist) {
        res.status(404).json({ error: "Companie not found" });
        return;
      }

      logger.info("Company found", { companieExist });
      res.status(200).json({ companieExist });
    } catch (error) {
      logger.error("Error getting company", { error: error.message });
      res
        .status(500)
        .json({ error: "There was an error getting the companie" });
    }
  }

  static async remove(req: Request, res: Response) {
    const { id } = req.params;
    logger.info("Deleting company by id", { id });

    try {
      const companie = await Companie.findByPk(id);
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
    const { id } = req.params;
    const { name, address, phone, email } = req.body;
    logger.info("Updating company by id", { id, name, address, phone, email });

    try {
      const companie = await Companie.findByPk(id);
      if (!companie) {
        res.status(404).json({ error: "Companie not found" });
        return;
      }

      await companie.update({ name, address, phone, email });
      logger.info("Company updated successfully", { companie });
      res.status(200).json({ msg: "Companie updated successfully", companie });
    } catch (error) {
      logger.error("Error updating company", { error: error.message });
      res
        .status(500)
        .json({ error: "There was an error updating the companie" });
    }
  }
}
