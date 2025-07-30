import {
  BarChart2,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

interface SidebarProps {
  isOpen: boolean;
}

const SidebarMenu: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Burada varsa auth temizliği yap
    // örn: localStorage.removeItem("token");

    // Doğru yönlendirme root (WelcomePage)
    navigate("/");
  };

  return (
    <aside
      className={`bg-[#0b1222] text-white h-screen p-4 pt-6 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } fixed top-0 left-0 z-40`}
    >
      <div className="flex items-center justify-center mb-8">
        <img
          src={logo}
          alt="Logo"
          className={`transition-all duration-300 ${isOpen ? "w-30" : "w-24"}`}
        />
      </div>
      <ul className="space-y-4">
        <li>
          <Link
            to="/prediction"
            className="flex items-center gap-3 hover:opacity-80"
          >
            <BarChart2 size={20} />
            {isOpen && <span>Prediction</span>}
          </Link>
        </li>


        <li>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 hover:opacity-80 w-full text-left"
          >
            <LogOut size={20} />
            {isOpen && <span>Sign Out</span>}
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default SidebarMenu;
