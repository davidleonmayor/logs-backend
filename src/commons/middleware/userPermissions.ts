import { Response, Request, NextFunction } from "express";
import Companie from "../../../db/models/Companie";
import { logger } from "../logger/logger";

declare global {
  namespace Express {
    interface Request {
      authCompanie?: Companie;
    }
  }
}

export async function isAuthenticatedCompanie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { companieId } = req.params;

  const companie = await Companie.findOne({
    where: { name: companieId },
  });
  if (companie.token !== "active") {
    logger.error("Unauthorized access", { companieId });
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.authCompanie = companie;

  next();
}
