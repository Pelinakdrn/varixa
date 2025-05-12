import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import fs from "fs";

export const uploadFileController = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).json({ message: "Dosya bulunamadı" });
      return;
    }

    const { startDate, endDate, uploadType, season, product, userId } = req.body;

    if (!startDate || !endDate || !uploadType || !userId) {
      res.status(400).json({ message: "Gerekli alanlar eksik" });
      return;
    }

    const fileData = fs.readFileSync(file.path);

    const saved = await prisma.uploadedFile.create({
      data: {
        filename: file.filename,
        fileData,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        uploadType,
        season: season || null,
        product: product || null,
        user: {
          connect: { id: userId },
        },
      },
    });

    res.status(200).json({ message: "Dosya başarıyla yüklendi", file: saved });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const getFileController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const fileRecord = await prisma.uploadedFile.findUnique({
      where: { id },
    });

    if (!fileRecord || !fileRecord.fileData) {
      res.status(404).json({ message: "Dosya bulunamadı" });
      return;
    }

    res.setHeader("Content-Disposition", `attachment; filename="${fileRecord.filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(fileRecord.fileData);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const listFilesController = async (_req: Request, res: Response): Promise<void> => {
  try {
    const files = await prisma.uploadedFile.findMany({
      select: {
        id: true,
        filename: true,
        startDate: true,
        endDate: true,
        uploadType: true,
        season: true,
        product: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json(files);
  } catch (err) {
    console.error("Dosya listeleme hatası:", err);
    res.status(500).json({ message: "Dosyalar alınamadı" });
  }
};
