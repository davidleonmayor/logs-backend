import { Router } from "express";
import { validateInputs } from "../common/middleware/resourceInputs";
import { CompanieCnt } from "./CompanieCnt";
import { GetOneCompanie, DeleteCompanie, UpdateCompanie } from "./schema";
import { isActiveCompanie } from "../common/middleware/userPermissions";
import { isAuthenticatedUser } from "../common/middleware/userPermissions";

const router = Router();

router.get(
  "/",
  validateInputs(GetOneCompanie),
  isAuthenticatedUser,
  isActiveCompanie,
  CompanieCnt.getOne
);
router.delete(
  "/",
  validateInputs(DeleteCompanie),
  isAuthenticatedUser,
  isActiveCompanie,
  CompanieCnt.remove
);
router.patch(
  "/",
  validateInputs(UpdateCompanie),
  isAuthenticatedUser,
  isActiveCompanie,
  CompanieCnt.update
);

export { router as companieRouter };
