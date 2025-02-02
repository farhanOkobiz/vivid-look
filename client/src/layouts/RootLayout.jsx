import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/shared/header/Header";
import Footer from "../components/shared/footer/Footer";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import FixedCart from "../components/floatcart/FixedCart";
import ScrollToTop from "react-scroll-to-top";
import whatsAppIcon from "../assets/logos/whatsAppIcon.png";
import messengerIcon from "../assets/logos/messengerIcon.png";

const RootLayout = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="font-inter">
      <Theme>
        <a
          href="https://m.me/vividlookbd"
          target="_blank"
          className="fixed right-[30px] bottom-[100px] z-[10000]"
        >
          <img
            src={messengerIcon}
            alt="Messenger Icon"
            className="w-10"
          />
        </a>

        <a
          href="https://wa.me/01871702222"
          target="_blank"
          className="fixed right-[30px] bottom-[150px] z-[10000]"
        >
          <img src={whatsAppIcon} alt="" className="w-10" />
        </a>

        <ScrollToTop
          style={{
            border: "1px solid",
            backgroundColor: "black",
            color: "white",
            width: "40px",
            height: "40px",
            fontWeight: "600",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            zIndex: "1000",
            right: "30px",
            bottom: "50px",
          }}
          className="rounded-full h-[50px] w-[50px] right-0 bottom-20 md:right-8 md:bottom-8 lg:right-40 lg:bottom-10"
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
