import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/verify-2fa", AuthController.verify2FA);

export default router;
