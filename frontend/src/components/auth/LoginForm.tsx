import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";
import { Link } from "react-router-dom";
import "../../css/hoverUnderline.css"; // ! CSS dosyanın doğru path'ine göre güncellemeyi unutma

const LoginForm = () => {
  return (
    <div className="w-full max-w-md mx-auto bg-[#0b1222] text-white p-6 rounded-xl shadow-lg border border-[#0b1222]">
      <h2 className="text-2xl font-semibold mb-1">Login</h2>
      <p className="text-sm text-gray-400 mb-6">
        Welcome back, enter your credentials to continue.
      </p>
      <form>
        <Input
          label="Username"
          name="username"
          placeholder="Enter your username"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
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
          <Button type="submit" variant="custom" className="hover-underline ">
            Log in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
