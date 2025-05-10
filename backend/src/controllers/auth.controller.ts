import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);
  res.status(result.status).json(result.data);
};

export const login = async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  res.status(result.status).json(result.data);
};
