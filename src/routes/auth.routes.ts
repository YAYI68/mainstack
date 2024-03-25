import { Router } from "express";
import { authLogin, authRegister, confirmPasswordReset, forgetPassword, getToken } from "../controllers/auth.controller";

const router = Router();

router.post("/login", authLogin);
router.post("/register", authRegister);
router.get("/refresh/token", getToken);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", confirmPasswordReset);

export default router;
