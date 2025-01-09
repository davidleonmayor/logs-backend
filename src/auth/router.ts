import { Router } from "express";
import { validateInputs } from "../common/middleware/resourceInputs";
import { AuthCnt } from "./AuthCnt";
import { CreateCompanie, ConfirmAccount, LoginCompanie } from "./schema";

const router = Router();
router.post("/create-account", validateInputs(CreateCompanie), AuthCnt.create);
router.post(
  "/confirm-account",
  validateInputs(ConfirmAccount),
  AuthCnt.confirmAccount
);
router.post("/login", validateInputs(LoginCompanie), AuthCnt.login);

export { router as authRouter };
