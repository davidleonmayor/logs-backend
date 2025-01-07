import type { Schema } from "express-validator";

export const CreateProduct: Schema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      errorMessage: "Name should be at least 3 chars long",
      options: { min: 3 },
    },
  },
  price: {
    in: ["body"],
    isNumeric: true,
    exists: {
      errorMessage: "Price is required",
    },
    isFloat: {
      errorMessage: "Amount must be a valid decimal number",
    },
    toFloat: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Amount must be a positive decimal number",
    },
  },
  amount: {
    in: ["body"],
    isInt: true,
    exists: {
      errorMessage: "Amount is required",
    },
    toInt: true,
    custom: {
      options: (value: number) => value > 0,
      errorMessage: "Amount must be a positive integer",
    },
  },
  companieId: {
    in: ["params"],
    isInt: true,
    exists: {
      errorMessage: "Companie is required",
    },
    toInt: true,
  },
};
