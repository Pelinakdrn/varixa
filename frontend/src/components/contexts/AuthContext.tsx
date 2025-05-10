import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type User = {
  id: string;
  email: string;
  companyId: string;
};

type AuthSuccess = { success: true };
type AuthFailure = { success: false; message: string };
type Auth2FARequired = { success: false; requires2FA: true; userId: string };
type LoginResult = AuthSuccess | AuthFailure | Auth2FARequired;

type AuthContextType = {
  auth: { token: string; user: User } | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  verify2FA: (userId: string, code: string) => Promise<{ success: boolean; message?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<{ token: string; user: User } | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user, requires2FA } = response.data;

      if (requires2FA) {
        return { success: false, requires2FA: true, userId: user.id };
      }

      localStorage.setItem("token", token);
      setAuth({ token, user });
      navigate("/dashboard");
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const verify2FA = async (userId: string, code: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-2fa", {
        userId,
        code,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setAuth({ token, user });
      navigate("/dashboard");

      return { success: true };
    } catch (error: any) {
      console.error("2FA error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Invalid code",
      };
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, verify2FA }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
