


// routes.js
import ForgotPassword from "components/loging/ForgotPassword";
import Login from "components/loging/Login";
import React from "react";
import { MdHome, MdOutlineShoppingCart, MdBarChart, MdLock, MdMoney, MdMoneyOffCsred, MdCategory } from "react-icons/md";
import CategoryManagement from "views/admin/categories/CategoryManagement";
import Dashboard from "views/admin/default/Dashboard";
import Expense from "views/admin/expense/Expense";
import Income from "views/admin/income/Income";
import Profile from "views/admin/Profile/Profile";
import Report from "views/admin/Report/Report";
import Transaction from "views/admin/Transaction/Transaction";

const getRoutes = (t) => [
  {
    name: t("dashboard"),
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <Dashboard />,
  },
  {
    name: t("category"),
    layout: "/admin",
    path: "categories",
    icon: <MdCategory className="h-6 w-6" />,
    component: <CategoryManagement />,
  },
  {
    name: t("income"),
    layout: "/admin",
    path: "income",
    icon: <MdMoney className="h-6 w-6" />,
    component: <Income />,
  },
   {
    name: t("expense"),
    layout: "/admin",
    path: "expense",
    icon: <MdMoneyOffCsred className="h-6 w-6" />,
    component: <Expense />,
  },
 
  {
    name: t("reports"),
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "report",
    component: <Report />,
  },
  {
    name: t("profile"),
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "profile",
    component: <Profile />,
  },

  {
    name: "Logout ",
    layout: "/auth",
    path: "login",
    icon: <MdLock className="h-6 w-6" />,
    component: <Login />,
  },
  {
  name: "Forgot Password",
  layout: "/auth",
  path: "forgot-password",
  icon: <MdLock className="h-6 w-6" />,
  component: <ForgotPassword />,
},

];

export default getRoutes;


