import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import getRoutes from "routes"; // This is the dynamic function now

export default function Admin(props) {
  const { user, setUser, ...rest } = props;
  const location = useLocation();
  const { t } = useTranslation();

  const routes = getRoutes(t); // generate translated route config
  const [open, setOpen] = useState(true);
  const [currentRoute, setCurrentRoute] = useState("Main Dashboard");

  // Sidebar toggle on screen resize
  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth >= 1200);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update current route text
  useEffect(() => {
    setCurrentRoute(getActiveRoute(routes));
  }, [location.pathname]);

  // Get active route name
  const getActiveRoute = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route?.layout && route?.path) {
        if (window.location.href.includes(route.layout + "/" + route.path)) {
          return route.name;
        }
      }
    }
    return "Main Dashboard";
  };

  // Get navbar style
  const getActiveNavbar = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route?.layout && route?.path) {
        if (window.location.href.includes(route.layout + "/" + route.path)) {
          return route.secondary || false;
        }
      }
    }
    return false;
  };

  // Render <Route> elements
  const renderRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return <Route path={`/${prop.path}`} element={prop.component} key={key} />;
      }
      return null;
    });
  };

  document.documentElement.dir = "ltr";

  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main className="mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]">
          <div className="h-full">
            <Navbar
              user={user}
              setUser={setUser}
              onOpenSidenav={() => setOpen(true)}
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5s mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {renderRoutes(routes)}
                <Route path="/" element={<Navigate to="/admin/default" replace />} />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
