import express, { Request } from "express";
import multer from "multer";
import path from "path";
import {
  uploadFileController,
  getFileController,
  listFilesController,
} from "../controllers/file.controller";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req: Request, file, cb) => {
      cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req: Request, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
});

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFileController);
router.get("/download/:id", getFileController);
router.get("/", listFilesController); // 👈 Yeni eklendi: tüm dosyaları listele

export default router;
