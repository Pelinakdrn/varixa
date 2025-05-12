import express from "express";
import multer from "multer";
import { previewDataset } from "../controllers/predict.controller";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/preview", upload.single("file"), previewDataset);

export default router;
