// backend/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { loginUser } from "../services/auth.service";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await loginUser(req.body);
    res.status(result.status).json(result.data);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err });
  }
};
