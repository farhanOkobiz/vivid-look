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
          className="fixed right-[35px] bottom-24 z-[10000]"
        >
          <img src={whatsAppIcon} alt="" className="w-10" />
        </a>
        <ScrollToTop
          style={{
            border: "1px solid",
            backgroundColor: "black",
            color: "white",
            width: "50px",
            height: "50px",
            fontWeight: "600",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            right: "30px"
          }}
          className="rounded-full"
          smooth
          color="white"
        />
        {/* {location.pathname != "/cart" && <FixedCart />} */}

        <Header />
        <Outlet />
        <Footer />
      </Theme>
    </div>
  );
};

export default RootLayout;
