import {
  BarChart2,
  Database,
  LineChart,
  Wallet,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

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
          src={logo}
          alt="Logo"
          className={`transition-all duration-300 ${isOpen ? "w-30" : "w-24"}`}
        />
      </div>
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80">
            <BarChart2 size={20} />
            {isOpen && <span>Prediction</span>}
          </Link>
        </li>
        <li>
          <Link to="/data-sources" className="flex items-center gap-3 hover:opacity-80">
            <Database size={20} />
            {isOpen && <span>Data Sources</span>}
          </Link>
        </li>
        <li>
          <div className="flex items-center gap-3">
            <LineChart size={20} />
            {isOpen && <span>Analysis</span>}
          </div>
        </li>
        <li>
          <div className="flex items-center gap-3">
            <Wallet size={20} />
            {isOpen && <span>Budget Planning</span>}
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
