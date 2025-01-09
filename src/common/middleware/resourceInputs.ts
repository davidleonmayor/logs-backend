import { Request, Response, NextFunction, RequestHandler } from "express";
import { checkSchema, Schema, validationResult } from "express-validator";

// declare global {
//   namespace Express {
//     interface Request {
//       budgetId?: number;
//     }
//   }
// }

export const validateInputs = (schema: Schema): RequestHandler[] => [
  ...checkSchema(schema),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    next();
  },
];
