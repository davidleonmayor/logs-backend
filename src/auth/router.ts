import { Router } from "express";
import { validateInputs } from "../common/middleware/resourceInputs";
import { AuthCnt } from "./AuthCnt";
import {
  CreateCompanie,
  ConfirmAccount,
  LoginCompanie,
  ForgotPassword,
  ResetPassword,
} from "./schema";
import { limiter } from "./utils/limiter";

const router = Router();

router.use(limiter);

router.post("/create-account", validateInputs(CreateCompanie), AuthCnt.create);
router.post(
  "/confirm-account",
  validateInputs(ConfirmAccount),
  AuthCnt.confirmAccount
);
router.post("/login", validateInputs(LoginCompanie), AuthCnt.login);

router.post(
  "/forgot-password",
  validateInputs(ForgotPassword),
  AuthCnt.forgotPassword
);
router.post(
  "/reset-password/:token",
  validateInputs(ResetPassword),
  AuthCnt.resetPasswordWithToken
);

export { router as authRouter };
