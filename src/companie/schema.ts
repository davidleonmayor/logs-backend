import type { Schema } from "express-validator";
// Auth
export const CreateCompanie: Schema = {
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
  password: {
    in: ["body"],
    exists: {
      errorMessage: "Password is required",
    },
    isString: {
      errorMessage: "Password must be a string",
    },
    isLength: {
      options: { min: 8, max: 60 },
      errorMessage: "Password must be between 8 and 60 characters",
    },
    matches: {
      options:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      errorMessage:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  },
};

export const ConfirmAccount: Schema = {
  token: {
    in: ["body"],
    exists: {
      errorMessage: "Token is required",
    },
    isNumeric: {
      errorMessage: "Token must be a number",
    },
    isLength: {
      options: { min: 6, max: 6 },
      errorMessage: "Token must be exactly 6 digits",
    },
    custom: {
      options: (value) => {
        if (parseInt(value, 10) <= 0) {
          throw new Error("Token must be a positive number");
        }
        return true;
      },
    },
  },
};

export const LoginCompanie: Schema = {
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
  password: {
    in: ["body"],
    exists: {
      errorMessage: "Password is required",
    },
    isString: {
      errorMessage: "Password must be a string",
    },
    isLength: {
      options: { min: 8, max: 60 },
      errorMessage: "Password must be between 8 and 60 characters",
    },
  },
  companieName: {
    in: ["params"],
    exists: {
      errorMessage: "ID is required",
    },
    isString: {
      errorMessage: "ID must be a string",
    },
    isLength: {
      options: { min: 1 },
      errorMessage: "ID must be at least 1 character long",
    },
    trim: true,
  },
};

// CRUD
export const GetOneCompanie: Schema = {
  companieName: {
    in: ["params"],
    exists: {
      errorMessage: "ID is required",
    },
    isString: {
      errorMessage: "ID must be a string",
    },
    isLength: {
      options: { min: 1 },
      errorMessage: "ID must be at least 1 character long",
    },
    trim: true,
  },
};

export const DeleteCompanie: Schema = {
  companieName: {
    in: ["params"],
    exists: {
      errorMessage: "ID is required",
    },
    isString: {
      errorMessage: "ID must be a string",
    },
    isLength: {
      options: { min: 1 },
      errorMessage: "ID must be at least 1 character long",
    },
    trim: true,
  },
};

export const UpdateCompanie: Schema = {
  companieName: {
    in: ["params"],
    exists: {
      errorMessage: "ID is required",
    },
    isString: {
      errorMessage: "ID must be a string",
    },
    isLength: {
      options: { min: 1 },
      errorMessage: "ID must be at least 1 character long",
    },
    trim: true,
  },
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
};
