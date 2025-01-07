import { Request, Response, NextFunction } from "express";
import Companie from "../../../db/models/Companie";

declare global {
  namespace Express {
    interface Request {
      companie?: Companie;
    }
  }
}

export const validateCompanieExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.params);
    const { companieId } = req.params;
    const companie = await Companie.findByPk(companieId);
    if (!companie) {
      const error = new Error("Companie not found");
      res.status(404).json({ error: error.message });
      return;
    }
    req.companie = companie;

    next();
  } catch (error) {
    // console.log(error)
    res.status(500).json({ error: "Hubo un error" });
  }
};
