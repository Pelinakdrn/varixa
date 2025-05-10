import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "varsayılan_secret_key";

// Kullanıcı Kaydı
export const registerUser = async (body: { email: string; password: string; companyId: string }) => {
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const secret = speakeasy.generateSecret({ name: `Varixa (${body.email})` });

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        company: { connect: { id: body.companyId } },
        twoFASecret: secret.base32,
        is2FAEnabled: true,
      },
    });

    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      status: 201,
      data: {
        message: "Kayıt başarılı, 2FA QR kodunu tarat",
        user: { id: user.id, email: user.email, companyId: user.companyId },
        qrCode: qrCodeDataURL,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: "Kayıt sırasında hata oluştu", error },
    };
  }
};

// Kullanıcı Giriş
export const loginUser = async (body: { email: string; password: string }) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user) return { status: 404, data: { message: "Kullanıcı bulunamadı" } };

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) return { status: 401, data: { message: "Şifre hatalı" } };

    if (user.is2FAEnabled) {
      return {
        status: 200,
        data: {
          message: "2FA doğrulama gerekli",
          requires2FA: true,
          userId: user.id,
        },
      };
    }

    const token = jwt.sign({ userId: user.id, companyId: user.companyId }, JWT_SECRET, { expiresIn: "1d" });

    return {
      status: 200,
      data: {
        message: "Giriş başarılı",
        token,
        user: { id: user.id, email: user.email, companyId: user.companyId },
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: "Giriş sırasında hata oluştu", error },
    };
  }
};

// 2FA Kod Doğrulama
export const verify2FACode = async (userId: string, token: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.twoFASecret) {
      return { status: 400, data: { message: "2FA verisi bulunamadı" } };
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) return { status: 401, data: { message: "Geçersiz 2FA kodu" } };

    const jwtToken = jwt.sign({ userId: user.id, companyId: user.companyId }, JWT_SECRET, { expiresIn: "1d" });

    return {
      status: 200,
      data: {
        message: "2FA doğrulama başarılı",
        token: jwtToken,
        user: { id: user.id, email: user.email, companyId: user.companyId },
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: { message: "2FA doğrulama sırasında hata oluştu", error },
    };
  }
};
