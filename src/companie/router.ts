import { Router } from "express";
import { validateInputs } from "../commons/middleware/resourceInputs";
import { CompanieCnt } from "./Controller";
import { CreateCompanie, GetOneCompanie, ConfirmAccount } from "./schema";
import { isAuthenticatedCompanie } from "../commons/middleware/userPermissions";

const router = Router();

router.post("/", validateInputs(CreateCompanie), CompanieCnt.create);
router.post(
  "/confirm-account",
  validateInputs(ConfirmAccount),
  CompanieCnt.confirmAccount
);

router.param("companieId", isAuthenticatedCompanie);

router.get("/:companieId", validateInputs(GetOneCompanie), CompanieCnt.getOne);
router.delete("/:companieId", CompanieCnt.remove);
router.put("/:id", validateInputs(CreateCompanie), CompanieCnt.update);

export { router as companieRouter };
