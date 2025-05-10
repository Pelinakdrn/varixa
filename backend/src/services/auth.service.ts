import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "varsayılan_secret_key";

export const registerUser = async (body: {
  email: string;
  password: string;
  companyId: string;
}) => {
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const secret = speakeasy.generateSecret({ name: "Varixa App 2FA" });

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        company: {
          connect: { id: body.companyId },
        },
        twoFactorSecret: secret.base32,
      },
    });

    return {
      status: 201,
      data: {
        message: "Kayıt başarılı",
        user: {
          id: user.id,
          email: user.email,
          companyId: user.companyId,
        },
        twoFactorSecret: secret.otpauth_url,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: "Kayıt sırasında hata oluştu", error },
    };
  }
};

export const loginUser = async (body: { email: string; password: string }) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user) return { status: 404, data: { message: "Kullanıcı bulunamadı" } };

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid)
      return { status: 401, data: { message: "Şifre hatalı" } };

    // Şifre doğruysa, frontend 2FA ekranına yönlendirir
    return {
      status: 200,
      data: {
        message: "Şifre doğru, 2FA doğrulama gerekiyor",
        userId: user.id,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: "Giriş sırasında hata oluştu", error },
    };
  }
};

export const verifyTwoFactorCode = async (body: {
  userId: string;
  code: string;
}) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: body.userId } });

    if (!user || !user.twoFactorSecret) {
      return { status: 404, data: { message: "Kullanıcı veya 2FA verisi yok" } };
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: body.code,
      window: 1,
    });

    if (!verified)
      return { status: 401, data: { message: "Geçersiz doğrulama kodu" } };

    const token = jwt.sign(
      { userId: user.id, companyId: user.companyId },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      status: 200,
      data: {
        message: "Doğrulama başarılı",
        token,
        user: {
          id: user.id,
          email: user.email,
          companyId: user.companyId,
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: "2FA doğrulama hatası", error },
    };
  }
};
