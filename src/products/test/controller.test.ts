import { createRequest, createResponse } from "node-mocks-http";
import { CompanieCnt } from "../../companie/CompanieCnt";
import { logger } from "../../common/logger/logger";
import { ProductsCnt } from "../ProductsCnt";
import cloudinary from "../../../claudinary/config";
import Product from "../../../db/models/Product";

jest.mock("../../common/logger/logger");
jest.mock("../../../claudinary/config");
jest.mock("../../../db/models/Product");

describe("ProductsCnt", () => {
  // describe("ProductsCnt - create", () => {
  //   it("should create a product successfully", async () => {
  //     const req = createRequest({
  //       method: "POST",
  //       url: "/api/companie/1/product",
  //       body: { name: "name", price: 200, amount: 4 },
  //       params: { companieId: 1 },
  //       file: {
  //         buffer: Buffer.from("test image buffer"),
  //       },
  //     });
  //     const res = createResponse();

  //     const mockUploadResult = {
  //       secure_url: "http://cloudinary.com/test-image-url",
  //     };

  //     cloudinary.uploader.upload_stream = jest.fn((options, callback) => {
  //       const stream = new require("stream").PassThrough();
  //       stream.end(); // Simula la finalización del stream
  //       callback(null, mockUploadResult);
  //       return stream;
  //     });

  //     Product.create = jest.fn().mockResolvedValue({
  //       toJSON: jest.fn().mockReturnValue({
  //         id: 1,
  //         name: "Test Product",
  //         price: 100.0,
  //         amount: 10,
  //         companieId: 1,
  //         imageUrl: "http://cloudinary.com/test-image-url",
  //       }),
  //     });

  //     await ProductsCnt.create(req, res);

  //     expect(res._getStatusCode()).toBe(201);
  //     expect(res._getJSONData()).toEqual({
  //       message: "Product created successfully",
  //       product: {
  //         id: 1,
  //         name: "Test Product",
  //         price: 100.0,
  //         amount: 10,
  //         companieId: 1,
  //         imageUrl: "http://cloudinary.com/test-image-url",
  //       },
  //     });

  //     expect(Product.create).toHaveBeenCalledTimes(1);
  //     expect(cloudinary.uploader.upload_stream).toHaveBeenCalledTimes(1);
  //   });
  // });

  describe("ProductsCnt - get", () => {
    it("should fetch products with pagination successfully", async () => {
      const req = createRequest({
        method: "GET",
        url: "/api/companie/1/products",
        query: { page: "1", limit: "10" },
        authCompanie: { id: 1 },
      });
      const res = createResponse();

      const mockProductData = {
        count: 1,
        rows: [
          {
            id: 1,
            name: "Product 1",
            price: 100,
            amount: 10,
            companieId: 1,
            createdAt: new Date("2025-01-14T17:14:21.791Z"),
          },
        ],
      };

      Product.findAndCountAll = jest.fn().mockResolvedValue(mockProductData);

      await ProductsCnt.get(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(res._getJSONData()).toEqual({
        products: mockProductData.rows.map((product) => ({
          ...product,
          createdAt: product.createdAt.toISOString(),
        })),
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 1,
          itemsPerPage: 10,
          hasMore: false,
        },
      });
    });

    it("should return an error if there is an exception", async () => {
      const req = createRequest({
        method: "GET",
        url: "/api/companie/1/products",
        query: { page: "1", limit: "10" },
        authCompanie: { id: 1 },
      });
      const res = createResponse();

      Product.findAndCountAll = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      await ProductsCnt.get(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        "Error fetching products:",
        expect.any(Error)
      );
      expect(res._getStatusCode()).toBe(500);
      expect(res._getJSONData()).toEqual({
        error: "Error fetching products",
        details: "Database error",
      });
    });
  });
});
