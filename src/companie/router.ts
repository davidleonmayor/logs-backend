import { Router } from "express";
import { validateInputs } from "../commons/middleware/resourceInputs";
import { CompanieCnt } from "./Controller";
import {
  CreateCompanie,
  GetOneCompanie,
  ConfirmAccount,
  DeleteCompanie,
  UpdateCompanie,
} from "./schema";
import { isActiveCompanie } from "../commons/middleware/userPermissions";

const router = Router();

router.post("/", validateInputs(CreateCompanie), CompanieCnt.create);
router.post(
  "/confirm-account",
  validateInputs(ConfirmAccount),
  CompanieCnt.confirmAccount
);

router.param("companieName", isActiveCompanie);

router.get(
  "/:companieName",
  validateInputs(GetOneCompanie),
  CompanieCnt.getOne
);
router.delete(
  "/:companieName",
  validateInputs(DeleteCompanie),
  CompanieCnt.remove
);
router.patch(
  "/:companieName",
  validateInputs(UpdateCompanie),
  CompanieCnt.update
);

export { router as companieRouter };
