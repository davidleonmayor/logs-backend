import type { Request, Response } from "express";
import { logger } from "../common/logger/logger";

export class CompanieCnt {
  static async getOne(req: Request, res: Response) {
    const { authCompanie } = req;

    try {
      const { password, token, ...companie } = authCompanie.toJSON();
      res.status(200).json({ companie });
    } catch (error) {
      logger.error("Error getting company", { error: error.message });
      res
        .status(500)
        .json({ error: "There was an error getting the companie" });
    }
  }

  static async remove(req: Request, res: Response) {
    const { authCompanie } = req;

    try {
      await authCompanie.destroy();
      logger.info("Company deleted successfully", { authCompanie });
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
      await authCompanie.update(body);
      res.status(200).json({ msg: "Companie updated successfully" });
    } catch (error) {
      logger.error("Error updating company", { error: error.message });
      res
        .status(500)
        .json({ error: "There was an error updating the companie" });
    }
  }
}
