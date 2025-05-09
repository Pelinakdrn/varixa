import LoginForm from "../components/auth/LoginForm";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#0b1222] text-white flex flex-col items-center justify-center px-4">
      <div className="mb-6 flex items-center gap-2 text-2xl font-semibold">
        Varixa
      </div>
      <Navbar />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
