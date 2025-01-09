import { Request, Response, NextFunction } from "express";
import Companie from "../../../db/models/Companie";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      companie?: Companie;
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
