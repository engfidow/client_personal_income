import React, { useEffect, useState } from "react";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import avatar from "assets/user.png";
import Dropdown from "components/dropdown";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import axios from "axios";

const Navbar = ({ onOpenSidenav, brandText }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const storedId = JSON.parse(sessionStorage.getItem("user"))?.id;
  const [user, setUser] = useState(null);
  const [darkmode, setDarkmode] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://server-personal-income.onrender.com/api/auth/me/${storedId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user info", err);
      }
    };

    if (storedId) fetchUser();
  }, [storedId]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("lang", lang);
    i18next.changeLanguage(lang);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white" href="#">
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white"> / </span>
          </a>
          <Link className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white" to="#">
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link to="#" className="font-bold capitalize hover:text-navy-700 dark:hover:text-white">
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        {/* Language Switcher */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="rounded-full bg-lightPrimary px-3 py-1 text-sm text-navy-700 dark:bg-navy-900 dark:text-white"
          >
            <option value="en">🇬🇧 English</option>
            <option value="so">🇸🇴 Somali</option>
          </select>
        </div>

        {/* Sidebar toggle */}
        <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden" onClick={onOpenSidenav}>
          <FiAlignJustify className="h-5 w-5" />
        </span>

        {/* Dark mode toggle */}
        <div className="cursor-pointer text-gray-600" onClick={() => {
          document.body.classList.toggle("dark");
          setDarkmode(!darkmode);
        }}>
          {darkmode ? <RiSunFill className="h-4 w-4" /> : <RiMoonFill className="h-4 w-4" />}
        </div>

        {/* User Dropdown */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={user?.image ? `https://server-personal-income.onrender.com/uploads/users/${user.image}` : avatar}
              alt={user?.name || "User"}
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey, {user?.name}
                  </p>
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20" />
              <div className="flex flex-col p-4">
                <button
                  onClick={handleLogout}
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
                >
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
