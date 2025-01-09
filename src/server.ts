import express, { urlencoded } from "express";
import morgan from "morgan";

import { companieRouter } from "./companie/router";
import { ProductsRouter } from "./products/router";
import { logger } from "./common/logger/logger";

export const app = express();

app.use(morgan("dev"));

// config
app.use(express.json());
app.use(urlencoded({ limit: "100mb", extended: true }));

// routes
app.get("/api", (req, res) => {
  res.send("Hello world...");
});

app.use("/api/companie", companieRouter);
app.use("/api", ProductsRouter);

// Error handling
app.use((err, req, res, next) => {
  logger.error("Internal server error", { error: err.message });
  res.status(err.status || 500).jsonp("Internal server error!");
});
