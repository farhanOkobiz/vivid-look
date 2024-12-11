import React from "react";
import Containar from "../../../layouts/Containar";
import { BsRocketTakeoff, BsCreditCard } from "react-icons/bs";
import { MdCurrencyExchange } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import { menusList, socialList } from "../../constants";

const MiddleFooter = () => {
  const servicelist = [
    {
      title: "Fast and free delivery",
      details: "Free delivery on purchases of 5,000 Taka",
      icon: BsRocketTakeoff,
    },
    {
      title: "Money back guarantee",
      details: "We return money within 30 days",
      icon: MdCurrencyExchange,
    },
    {
      title: "24/7 customer support",
      details: "Friendly 24/7 customer support",
      icon: BiSupport,
    },
    {
      title: "Secure online payment",
      details: "We possess SSL / Secure сertificate",
      icon: BsCreditCard,
    },
  ];

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
    <div className="bg-[#2B3445] px-10">
      <Containar>
        <div>
          <ul className="flex flex-wrap items-center gap-y-8 justify-between py-8 border-b border-b-gray-600">
            {servicelist.map((item, index) => {
              let Icon = item.icon;
              return (
                <li
                  key={index}
                  className="flex w-full sm:w-1/2 lg:w-[24%]  gap-x-5 items-center"
                >
                  <h3>
                    <Icon className="lg:text-3xl xl:text-3xl text-primary" />
                  </h3>
                  <div>
                    <h3 className="text-sm text-white font-medium">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-normal mt-1">
                      {item.details}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div>
            <ul className="flex justify-between flex-wrap py-8">
              <li className="">
                <Link
                  to={"/"}
                  className=" text-lg font-medium text-primary uppercase"
                >
                  Vivid Look
                </Link>
                <div className="flex flex-col gap-x-5 gap-y-2 mt-5">
                  {infolist.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item.link}
                        className="text-sm text-gray-400 hover:text-primary transition-all ease-linear duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </div>
              </li>
              <li className="">
                <div className="text-lg font-medium text-primary uppercase">
                  Pages
                </div>
                <div className="flex flex-col gap-x-5 gap-y-2 mt-5">
                  {menusList.map((item, index) => (
                    <li key={index}>
                      <Link
                        className="text-sm text-gray-400 hover:text-primary transition-all ease-linear duration-200"
                        to={item?.link}
                      >
                        {item?.name}
                      </Link>
                    </li>
                  ))}
                </div>
              </li>
              <li className="">
                <div className="text-lg font-medium text-primary uppercase">
                  Shipping Info
                </div>
                <div className="flex flex-col gap-x-5 gap-y-2 mt-5">
                  {accountList.map((item, index) => (
                    <li key={index}>
                      <Link
                        to={item?.link}
                        className="text-sm text-gray-400 hover:text-primary transition-all ease-linear duration-200"
                      >
                        {item?.name}
                      </Link>
                    </li>
                  ))}
                </div>
              </li>
              <li className="">
                <div className="text-lg font-medium text-primary uppercase">
                  Stay Connected
                </div>
                <div className="mt-5 flex flex-col gap-x-5 gap-y-2">
                  <div className="text-sm text-gray-400 hover:text-primary transition-all ease-linear duration-200">
                    Mirpur-10,Senpara,Dhaka-1216
                  </div>
                  <a
                    href="mailto:tuhincrpkhan@gmail.com"
                    className="text-sm text-gray-400 hover:text-primary transition-all ease-linear duration-200 uppercase"
                  >
                    tuhincrpkhan@gmail.com
                  </a>
                  <div>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.8940731822164!2d90.3665231!3d23.804678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ4JzE2LjgiTiA5MMKwMjInMDguOCJF!5e0!3m2!1sen!2s!4v1700000000000"
                      width="100%"
                      className="h-52"
                      style={{ border: "0" }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default MiddleFooter;
