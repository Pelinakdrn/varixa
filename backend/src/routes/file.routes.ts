// src/routes/file.routes.ts
import express from "express";
import multer from "multer";
import path from "path";
import { uploadFileController, getFileController } from "../controllers/file.controller";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
});

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFileController);
router.get("/download/:filename", getFileController);

export default router;
