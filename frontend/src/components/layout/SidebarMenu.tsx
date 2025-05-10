import {
  LayoutDashboard,
  Inbox,
  Users,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png"; 

interface SidebarProps {
  isOpen: boolean;
}

const SidebarMenu: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside
      className={`bg-[#0b1222] text-white h-screen p-4 pt-6 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } fixed top-0 left-0 z-40`}
    >
      <div className="flex items-center justify-center mb-8">
        <img
          src={Logo}
          alt="Logo"
          className={`transition-all duration-300 ${
            isOpen ? "w-30" : "w-24"
          }`}
        />
      </div>
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80">
            <LayoutDashboard size={20} />
            {isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <div className="flex items-center gap-3">
            <Inbox size={20} />
            {isOpen && <span>Inbox</span>}
          </div>
        </li>
        <li>
          <div className="flex items-center gap-3">
            <Users size={20} />
            {isOpen && <span>Users</span>}
          </div>
        </li>
        <li>
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} />
            {isOpen && <span>Products</span>}
          </div>
        </li>
        <li>
          <div className="flex items-center gap-3">
            <LogOut size={20} />
            {isOpen && <span>Sign Out</span>}
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default SidebarMenu;
