import express, { urlencoded } from "express";
import morgan from "morgan";

import { companieRouter } from "./companie/router";
import { ProductsRouter } from "./products/router";

export const app = express();

app.use(morgan("dev"));

// config
app.use(express.json());
app.use(urlencoded({ limit: "100mb", extended: true }));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).jsonp("Internal server error!");
  next();
});

// routes
app.get("/", (req, res) => {
  res.send("Hello world...");
});

// routers
app.use("/api/companie", companieRouter);
app.use("/api", ProductsRouter);
