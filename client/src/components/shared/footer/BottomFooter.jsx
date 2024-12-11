import React from "react";
import Containar from "../../../layouts/Containar";
import logo from "../../../assets/logos/logoBlack.jpg";
import { Link } from "react-router-dom";

const BottomFooter = () => {
  return (
    <footer className="font-inter py-5 bg-black px-10">
      <Containar>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            ©2024 Vivid Look, All rights reserved. Developed by
            <span className="text-white mx-2">
              <Link target="_blanck" to={"https://www.okobiz.com/"}>
                OKOBIZ.
              </Link>
            </span>
          </p>
          <Link className="flex items-baseline" to={"/"}>
            <div className="w-14">
              <img className="w-full" src={logo} />
            </div>
          </Link>
        </div>
      </Containar>
    </footer>
  );
};

export default BottomFooter;
