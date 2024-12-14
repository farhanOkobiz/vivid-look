import React from "react";
import UpperHeader from "./UpperHeader";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import LogoContainer from "./LogoContainer";

const header = () => {
  return (
    <>
      {/* <LogoContainer /> */}

      {/* <UpperHeader /> */}
      <Navbar />
      <MobileNavbar />
    </>
  );
};

export default header;
