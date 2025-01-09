import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Companie from "../../../db/models/Companie";
import { logger } from "../logger/logger";

declare global {
  namespace Express {
    interface Request {
      authCompanie?: Companie;
    }
  }
}

export const isAuthenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if bearer token is present
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ error: "Unauthorized: Token missing or invalid format" });
    return;
  }

  // the token has the correct format?
  const [, token] = bearer.split(" ");
  if (!token) {
    res.status(401).json({ error: "Unauthorized: Token is required" });
    return;
  }

  try {
    const result = jwt.verify(token, process.env.JWT_TOKEN);
    // console.log("result", result);
    if (typeof result === "object" && result.id) {
      const companie = await Companie.findByPk(result.id, {
        attributes: { exclude: ["password", "token"] },
      });
      if (!companie) {
        res.status(404).json({ error: "Companie doesn't exist" });
        return;
      }

      req.authCompanie = companie;

      next();
    } else {
      res
        .status(401)
        .json({ error: "Unauthorized: Invalid token or verification failed" });
      return;
    }
  } catch (error) {
    console.error("Invalid token:", error.message);
    res.status(500).json({ error: "Invalid token or verification failed" });
  }
};

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
