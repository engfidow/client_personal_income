import React from "react";
import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";
import getRoutes from "routes"; // function now
import { MdLock } from "react-icons/md";

const Sidebar = ({ open, onClose }) => {
  const { t } = useTranslation();
  const routes = getRoutes(t); // 👈 generate translated routes

  const handleLogout = () => {
    localStorage.removeItem("user.email");
    sessionStorage.removeItem("user.user");
    window.location.href = "/auth/login";
  };

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[30px] mt-[50px] flex items-center`}>
        <div className="h-1.5 font-bold text-navy-700 dark:text-white flex items-center justify-center gap-3">
          <img src={logo} alt="" width={150} />
         
        </div>
      </div>
      <div className="mt-[30px] mb-7 h-px bg-gray-300 dark:bg-white/30" />

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>
    </div>
  );
};

export default Sidebar;
