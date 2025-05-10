// src/components/layout/Layout.tsx
import { useState, type ReactNode } from "react";
import SidebarMenu from "./SidebarMenu";
import Topbar from "./Topbar";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="flex bg-gray-100 dark:bg-[#0b1222]">
      <SidebarMenu isOpen={isOpen} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
