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

    const secret = speakeasy.generateSecret({ name: "Varixa App" });

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        company: {
          connect: { id: body.companyId },
        },
        twoFactorSecret: secret.base32,
        is2FAEnabled: false, 
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

    if (!user.twoFactorSecret) {
      return { status: 400, data: { message: "2FA verisi eksik" } };
    }

    // Eğer 2FA daha önce etkinleştirildiyse, QR göstermeye gerek yok
    if (user.is2FAEnabled) {
      return {
        status: 200,
        data: {
          message: "Şifre doğru, 2FA doğrulama gerekiyor",
          userId: user.id,
          user: {
            id: user.id,
            email: user.email,
            companyId: user.companyId,
          },
          requires2FA: true,
        },
      };
    }

    // İlk giriş — QR kod oluştur ve göster
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: user.twoFactorSecret,
      label: user.email,
      issuer: "Varixa App",
      encoding: "base32",
    });

    return {
      status: 200,
      data: {
        message: "İlk giriş, 2FA kuruluyor",
        userId: user.id,
        user: {
          id: user.id,
          email: user.email,
          companyId: user.companyId,
        },
        otpAuthUrl,
        requires2FA: true,
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

    if (!user.is2FAEnabled) {
      await prisma.user.update({
        where: { id: user.id },
        data: { is2FAEnabled: true },
      });
    }

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
