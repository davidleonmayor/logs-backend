import type { Schema } from "express-validator";

export const GetOneCompanie: Schema = {
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

export const DeleteCompanie: Schema = {
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

export const UpdateCompanie: Schema = {
  name: {
    in: ["body"],
    exists: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { min: 1, max: 100 },
      errorMessage: "Name must be between 1 and 100 characters",
    },
    trim: true,
  },
  address: {
    in: ["body"],
    exists: {
      errorMessage: "Address is required",
    },
    isString: {
      errorMessage: "Address must be a string",
    },
    isLength: {
      options: { min: 1, max: 200 },
      errorMessage: "Address must be between 1 and 200 characters",
    },
    trim: true,
  },
  phone: {
    in: ["body"],
    exists: {
      errorMessage: "Phone is required",
    },
    isNumeric: {
      errorMessage: "Phone must be a number",
    },
    isLength: {
      options: { min: 10, max: 10 },
      errorMessage: "Phone must be exactly 10 digits",
    },
    custom: {
      options: (value) => {
        if (parseInt(value, 10) <= 0) {
          throw new Error("Phone must be a positive number");
        }
        return true;
      },
    },
    trim: true,
  },
  email: {
    in: ["body"],
    exists: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Email must be a valid email address",
    },
    isLength: {
      options: { max: 100 },
      errorMessage: "Email must not exceed 100 characters",
    },
    normalizeEmail: true,
  },
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
