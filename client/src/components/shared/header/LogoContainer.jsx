import React from "react";
import Containar from "../../../layouts/Containar";
import { Link } from "react-router-dom";
import logo from "../../../assets/logos/logoBlack.jpg";

const LogoContainer = () => {
  return (
    <Containar>
      <div className="flex justify-center items-center text-2xl font-bold text-gray-800">
        <Link to="/" className="flex items-center">
          <div className="p-2">
            <img
              src={logo}
              alt="Logo"
              className="w-24 lg:w-40 lg:h-20 object-contain rounded-md"
            />
          </div>
        </Link>
      </div>
    </Containar>
  );
};

export default LogoContainer;
