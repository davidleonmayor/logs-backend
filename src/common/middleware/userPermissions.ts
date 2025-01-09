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
  const { companieName } = req.params;

  const companie = await Companie.findOne({
    where: { name: companieName },
  });
  console.log(companie);
  if (!companie) {
    logger.error("Companie not found", { companieName });
    res.status(404).json({ error: "Companie not found" });
    return;
  }
  if (companie.token !== "active") {
    logger.error("Unauthorized access", { companieName });
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  req.authCompanie = companie;

  next();
}

// export async function isAuthenticatedCompanie(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { companieName } = req.params;

//   const companie = await Companie.findOne({
//     where: { name: companieName },
//   });
//   console.log(companie);
//   if (!companie) {
//     logger.error("Companie not found", { companieName });
//     res.status(404).json({ error: "Companie not found" });
//     return;
//   }
//   if (companie.token !== "active") {
//     logger.error("Unauthorized access", { companieName });
//     res.status(401).json({ error: "Unauthorized" });
//     return;
//   }

//   req.authCompanie = companie;

//   next();
// }
