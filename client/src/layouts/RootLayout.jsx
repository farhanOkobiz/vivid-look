import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/shared/header/Header";
import Footer from "../components/shared/footer/Footer";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import FixedCart from "../components/floatcart/FixedCart";
import ScrollToTop from "react-scroll-to-top";
import whatsAppIcon from "../assets/logos/whatsAppIcon.png";

const RootLayout = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="font-inter">
      <Theme>
        <a
          href="https://wa.me/01871702222"
          target="_blank"
          className="fixed right-10 bottom-24"
        >
          <img src={whatsAppIcon} alt="" className="w-10" />
        </a>
        <ScrollToTop
          style={{ backgroundColor: "#fff6f6", border: "1px solid #f74545" }}
          className="bg-red-500 inline-block"
          smooth
          color="#f75454"
        />
        {location.pathname != "/cart" && <FixedCart />}

        <Header />
        <Outlet />
        <Footer />
      </Theme>
    </div>
  );
};

export default RootLayout;
