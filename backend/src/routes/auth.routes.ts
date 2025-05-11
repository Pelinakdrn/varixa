import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/login", AuthController.login);
router.post("/Verify2fFA", AuthController.verify2FA);

export default router;
