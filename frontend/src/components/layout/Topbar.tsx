import { Menu } from "lucide-react";
import React from "react";

interface TopbarProps {
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="h-14 shadow flex items-center justify-between px-4 bg-[#0b1222]">
      <button
        className="text-white focus:outline-none"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>
      <div className="flex items-center gap-4">
        <button className="text-white">
          🔔
        </button>
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Topbar;
