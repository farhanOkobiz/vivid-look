import React from "react";
import Containar from "../../../layouts/Containar";
import { BsRocketTakeoff, BsCreditCard } from "react-icons/bs";
import { MdCurrencyExchange } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { menusList, socialList } from "../../constants";

const MiddleFooter = () => {
  // const servicelist = [
  //   {
  //     title: "Fast and free delivery",
  //     details: "Free delivery on purchases of 5,000 Taka",
  //     icon: BsRocketTakeoff,
  //   },
  //   {
  //     title: "Money back guarantee",
  //     details: "We return money within 30 days",
  //     icon: MdCurrencyExchange,
  //   },
  //   {
  //     title: "24/7 customer support",
  //     details: "Friendly 24/7 customer support",
  //     icon: BiSupport,
  //   },
  //   {
  //     title: "Secure online payment",
  //     details: "We possess SSL / Secure сertificate",
  //     icon: BsCreditCard,
  //   },
  // ];

  const infolist = [
    {
      name: "Outlets",
      link: "/contact",
    },
    // {
    //   name: "Shop Address",
    //   link: "/contact",
    // },
    {
      name: "Support",
      link: "/contact",
    },
    {
      name: "Privacy",
      link: "/privacy",
    },
    {
      name: "Terms & Condition",
      link: "/terms-condition",
    },
    // {
    //   name: "FAQ",
    //   link: "/faq",
    // },
  ];

  const accountList = [
    {
      name: "Shipping rates & policies",
      link: "/shipingrates-policy",
    },
    {
      name: "Refunds & replacements",
      link: "/refund-replace",
    },
    {
      name: "Delivery info",
      link: "/delivery-info",
    },
    {
      name: "About us",
      link: "/about",
    },
  ];

  return (
    <div className="bg-white">
      <div>
        <ul className="flex flex-wrap items-center gap-x-8 justify-center py-8 border-b border-b-gray-600 bg-black">
          {/* {servicelist.map((item, index) => {
              let Icon = item.icon;
              return (
                <li
                  key={index}
                  className="flex w-full sm:w-1/2 lg:w-[24%]  gap-x-5 items-center"
                >
                  <h3>
                    <Icon className="lg:text-3xl xl:text-3xl text-white" />
                  </h3>
                  <div>
                    <h3 className="text-md text-gray-200 font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-normal mt-1">
                      {item.details}
                    </p>
                  </div>
                </li>
              );
            })} */}
          {socialList.map((item, index) => {
            const Icon = item.logo;
            return (
              <Link
                key={index}
                to={item.link}
                className="group transition-transform transform"
                target="_blank"
              >
                <Icon className="w-8 h-8 bg-white p-2 text-black rounded-md group-hover:scale-110 transition-transform duration-300 ease-in-out" />
              </Link>
            );
          })}
        </ul>

        <Containar>
          <div>
            <ul className="flex flex-col md:flex-row space-y-5 md:space-y-0 justify-between flex-wrap py-8 px-4">
              <li className="">
                <Link
                  to={"/"}
                  className=" text-lg font-medium text-gray-700 uppercase"
                >
                  Vivid Look
                </Link>
                <div className="flex flex-col gap-x-5 gap-y-2 mt-5">
                  {infolist.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="text-sm text-gray-600 hover:text-gray-800 transition-all ease-linear duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </div>
              </li>
              <li className="">
                <div className="text-lg font-medium text-gray-700 uppercase">
                  Pages
                </div>
                <div className="flex flex-col gap-x-5 gap-y-2 mt-5">
                  {menusList.map((item, index) => (
                    <li key={index}>
                      <Link
                        className="text-sm text-gray-600 hover:text-gray-800 transition-all ease-linear duration-200"
                        to={item?.link}
                      >
                        {item?.name}
                      </Link>
                    </li>
                  ))}
                </div>
              </li>
              <li className="">
                <div className="text-lg font-medium text-gray-700 uppercase">
                  Shipping Info
                </div>
                <div className="flex flex-col gap-x-5 gap-y-2 mt-5">
                  {accountList.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item?.link}
                        className="text-sm text-gray-600 hover:text-gray-800 transition-all ease-linear duration-200"
                      >
                        {item?.name}
                      </Link>
                    </li>
                  ))}
                </div>
              </li>
              <li className="">
                <div className="text-lg font-medium text-gray-700 uppercase">
                  Stay Connected
                </div>
                <div className="mt-5 flex flex-col gap-x-5 gap-y-2">
                  <div className="text-sm text-gray-600 hover:text-gray-800 transition-all ease-linear duration-200">
                    BAKALIA, CHATTOGRAM, BANGLADESH
                  </div>
                  <a
                    href="mailto:sohel204@gmail.com"
                    className="text-sm text-gray-600 hover:text-gray-800 transition-all ease-linear duration-200 uppercase"
                  >
                    sohel204@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </Containar>
      </div>
    </div>
  );
};

export default MiddleFooter;
