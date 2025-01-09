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

export async function isActiveCompanie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authCompanie } = req;

  if (authCompanie.token !== "active") {
    logger.error("Unactive companie", { authCompanie });
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
