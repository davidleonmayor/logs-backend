import { Request, Response } from "express";
import { Readable } from "stream";
import formidable from "formidable";
import { v4 as uuid } from "uuid";

import Product from "../../db/models/Product";
import { logger } from "../common/logger/logger";

import cloudinary from "../../claudinary/config";
import Companie from "../../db/models/Companie";

export class ProductsCnt {
  static async create(req: Request, res: Response) {
    try {
      const { name, price, amount } = req.body;
      const { companieId } = req.params;
      const imageFile = req.file;

      if (!imageFile) {
        res.status(400).json({ error: "Image is required" });
        return;
      }

      // Convertir el buffer a un stream que Cloudinary pueda usar
      const stream = Readable.from(imageFile.buffer);

      // Crear una promesa para manejar la subida a Cloudinary
      const cloudinaryUpload = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.pipe(uploadStream);
      });

      // Esperar a que la imagen se suba a Cloudinary
      const uploadResult = (await cloudinaryUpload) as any;

      // Crear el producto en la base de datos con la URL de Cloudinary
      const product = await Product.create({
        name,
        price,
        amount,
        companieId,
        imageUrl: uploadResult.secure_url, // URL segura de Cloudinary
      });

      res.status(201).json({
        message: "Product created successfully",
        product: {
          ...product.toJSON(),
          imageUrl: uploadResult.secure_url,
        },
      });
    } catch (error) {
      logger.error("Error creating product:", error);
      res.status(500).json({
        error: "Error creating product",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async get(req: Request, res: Response) {
    const { authCompanie } = req;

    try {
      // Parámetros de paginación
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12; // Productos por página
      const offset = (page - 1) * limit;

      // Obtener productos con paginación
      const { count, rows: products } = await Product.findAndCountAll({
        where: {
          companieId: authCompanie.id,
        },
        limit,
        offset,
        order: [["createdAt", "DESC"]], // Ordenar por más reciente
        // include: [
        //   {
        //     model: Companie,
        //     attributes: ["name"], // Solo incluir el nombre de la compañía
        //     where: {
        //       isActive: true, // Solo productos de compañías activas
        //     },
        //   },
        // ],
      });

      // Calcular información de paginación
      const totalPages = Math.ceil(count / limit);
      const hasMore = page < totalPages;

      res.status(200).json({
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasMore,
        },
      });
    } catch (error) {
      logger.error("Error fetching products:", error);
      res.status(500).json({
        error: "Error fetching products",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
