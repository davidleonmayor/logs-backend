import { Request, Response } from "express";
import Product from "../../db/models/Product";
import { logger } from "../common/logger/logger";

export class ProductsCnt {
  static async create(req: Request, res: Response) {
    const { companie } = req;
    const { name, price, amount } = req.body;

    try {
      // create the product
      const createdProduct = await Product.create({
        name,
        price,
        amount,
        companieId: companie.id,
      });

      res.status(201).send("Product created successfully");
    } catch (error) {
      logger.error("Error creating company", { error: error.message });
      res
        .status(500)
        .json({ error: "There was an error creating the product" });
    }
  }
}
