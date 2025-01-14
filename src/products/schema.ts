import { body, validationResult, type Schema } from "express-validator";

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

export const validateProduct = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 3 })
    .withMessage("Name should be at least 3 characters long"),

  body("price")
    .exists()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a valid number")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("amount")
    .exists()
    .withMessage("Amount is required")
    .isInt({ min: 1 })
    .withMessage("Amount must be a positive integer"),

  // Middleware para verificar los resultados de la validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const getProducts: Schema = {
  authorization: {
    in: ["headers"],
    exists: {
      errorMessage: "Authorization header is required",
    },
    isString: {
      errorMessage: "Authorization header must be a string",
    },
    isLength: {
      options: { min: 1 },
      errorMessage: "Authorization header must be at least 1 character long",
    },
    custom: {
      options: (value) => {
        if (!value.startsWith("Bearer ")) {
          throw new Error("Authorization header must start with 'Bearer '");
        }
        return true;
      },
    },
  },
};
