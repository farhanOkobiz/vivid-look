import React from "react";
import { FaMapLocation } from "react-icons/fa6";

import Containar from "../../../layouts/Containar";
import { Link } from "react-router-dom";
import LogoContainer from "./LogoContainer";
import { CiMobile3 } from "react-icons/ci";

const UpperHeader = () => {
  return (
    <header className="">
      <div className="border-b py-4 bg-[#E53E3E] text-white">
        <Containar>
          <div className="mx-auto">
            <div className="flex flex-col lg:flex-row justify-center xl:justify-between items-center text-sm space-y-2 xl:space-y-0 lg:px-5 xl:px-0">
              {/* Left Section */}
              <div className="flex flex-col xl:flex-row justify-center items-center space-y-2 xl:space-y-0 xl:space-x-4">
                <div className="flex gap-2 text-sm">
                  {/* <a
                    className="flex items-center  transition-all ease-linear duration-200 hover:underline "
                    href="tel:01924853285"
                  >
                   01924853285
                  </a> */}

                  {/* <span>|</span> */}
                  <a
                    href="https://www.facebook.com/mas.dreamangel?mibextid=ZbWKwL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" hover:underline "
                  >
                    Facebook
                  </a>
                  <span>|</span>
                  <a
                    href="https://www.instagram.com/massajib/?igsh=dWJlNTdrem44c3px#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" hover:underline "
                  >
                    Instagram
                  </a>
                  <span>|</span>
                  <a
                    href="https://www.youtube.com/@user-mk_kitchen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" hover:underline"
                  >
                    Youtube
                  </a>
                </div>
              </div>

              {/* Middle Section */}
              {/* <LogoContainer /> */}

              {/* Right Section */}
              <div className="hidden lg:flex space-x-4">
                <Link
                  to="/about"
                  className="hover:text-gray-900 hover:underline duration-200"
                >
                  About us
                </Link>
                <Link
                  to="/contact"
                  className="hover:text-gray-900 hover:underline duration-200"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </Containar>
      </div>
    </header>
  );
};

export default UpperHeader;
