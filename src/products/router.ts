import { Router } from "express";
import { validateInputs } from "../common/middleware/resourceInputs";
import { ProductsCnt } from "./Controller";
import { CreateProduct } from "./schema";
import { validateCompanieExists } from "../companie/middleware/cheker";

const router = Router();

router.post(
  "/:companieId/product",
  validateInputs(CreateProduct),
  validateCompanieExists,
  ProductsCnt.create
);

// router.get("/:id", CompanieCnt.getOne);

// router.delete("/:id", CompanieCnt.remove);

// router.put("/:id", validateInputs(CreateCompanie), CompanieCnt.update);

export { router as ProductsRouter };
