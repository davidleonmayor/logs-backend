import { Router } from "express";
import { validateInputs } from "../common/middleware/resourceInputs";
import { CompanieCnt } from "./Controller";
import {
  CreateCompanie,
  GetOneCompanie,
  ConfirmAccount,
  DeleteCompanie,
  UpdateCompanie,
  LoginCompanie,
} from "./schema";
import { isActiveCompanie } from "../common/middleware/userPermissions";

const router = Router();

// Auth
router.post("/", validateInputs(CreateCompanie), CompanieCnt.create);
router.post(
  "/confirm-account",
  validateInputs(ConfirmAccount),
  CompanieCnt.confirmAccount
);
router.post(
  "/login/:companieName",
  validateInputs(LoginCompanie),
  isActiveCompanie,
  CompanieCnt.login
);

// CRUD
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
