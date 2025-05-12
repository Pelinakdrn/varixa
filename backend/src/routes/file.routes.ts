import express, { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { uploadFileController, getFileController } from "../controllers/file.controller";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
});

const router = express.Router();

router.post("/upload", upload.single("file"), uploadFileController);
router.get("/download/:filename", getFileController);

export default router;
