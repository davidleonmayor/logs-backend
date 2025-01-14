import dotenv from "dotenv";
dotenv.config();

import express, { urlencoded, json } from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import { companieRouter } from "./companie/router";
import { ProductsRouter } from "./products/router";
import { authRouter } from "./auth/router";
import { logger } from "./common/logger/logger";

export const app = express();

app.use(morgan("dev"));

export const corsConfig: CorsOptions = {
  origin: function (origin: string | undefined, callback) {
    const allowedOrigins = [process.env.FRONTEDN_URL];
    if (process.argv[2] === "--api") {
      allowedOrigins.push(undefined);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.error("Error de cors", { origin });
      callback(new Error("Error de cors"));
    }
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["content-type", "authorization"],
};
app.use(cors(corsConfig));

// config
app.use(json());
app.use(urlencoded({ limit: "100mb", extended: true }));

// routes
app.get("/api", (req, res) => {
  res.send("Hello world...");
});
app.use("/api/auth", authRouter);
app.use("/api/companie", companieRouter);
app.use("/api/companie", ProductsRouter);
