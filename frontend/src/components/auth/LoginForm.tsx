import { useState } from "react";
import { useAuth } from "../../components/contexts/AuthContext";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import "../../css/hoverUnderline.css";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(email, password);

    if ("requires2FA" in result && result.requires2FA) {
      navigate("/verify-2fa", { state: { userId: result.userId } });
    } else if ("success" in result && result.success) {
      navigate("/dashboard");
    } else if ("message" in result) {
      alert(result.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0b1222] text-white p-6 rounded-xl shadow-lg border border-[#0b1222]">
      <h2 className="text-2xl font-semibold mb-1">Login</h2>
      <p className="text-sm text-gray-400 mb-6">
        Welcome back, enter your credentials to continue.
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-between mb-4">
          <Checkbox label="Remember me" name="remember" />
          <Link
            to="/forgot-password"
            className="text-sm text-blue-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="flex justify-center items-center gap-4">
          <Button type="submit" variant="custom" className="hover-underline">
            Log in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
