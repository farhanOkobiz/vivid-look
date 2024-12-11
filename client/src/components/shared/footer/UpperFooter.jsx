import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Containar from "../../../layouts/Containar";
import { socialList } from "../../constants";
import { Link } from "react-router-dom";
import ApiContext from "../../baseapi/BaseApi";

const UpperFooter = () => {
  const [categories, setCategories] = useState([]);

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
  const baseApi = useContext(ApiContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseApi}/category`);
        setCategories(response.data.data.doc); // Assuming response.data contains the array of categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="py-12 font-inter bg-[#373F50] px-10">
      <Containar>
        <div className="w-full flex justify-between flex-wrap">
          <div className="w-1/2 md:w-1/3">
            <h3 className="text-base md:text-lg text-white font-semibold uppercase">
              Shop Categories
            </h3>
            <ul className="mt-6 flex flex-col gap-y-4">
              {categories.slice(0, 6).map((item, index) => (
                <li key={index}>
                  <Link
                    to={`/shop/category/${item?._id}`}
                    className="text-base hover:pl-1.5 cursor-pointer text-gray-400 transition-all ease-linear duration-200 hover:text-danger inline-block"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-1/2 md:w-1/3">
            <h3 className="text-base md:text-lg text-white font-semibold uppercase">
              Shipping info
            </h3>
            <ul className="mt-6 flex flex-col gap-y-4">
              {accountList.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item?.link}
                    className="text-base text-gray-400 hover:pl-1.5 cursor-pointer transition-all ease-linear duration-200 hover:text-danger inline-block"
                  >
                    {item?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <div className="w-full">
              <h3 className="text-base md:text-lg text-white font-semibold uppercase">
                Stay Connected
              </h3>
              <div className="mt-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14605.566158165803!2d90.3538354!3d23.760407!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf4c07586257%3A0x36727b84436f9908!2sRCC%20DESIGN%20AND%20DEVELOPERS%20LTD.!5e0!3m2!1sen!2sbd!4v1698503497107!5m2!1sen!2sbd"
                  width="100%"
                  className="h-52"
                  style={{ border: "0" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default UpperFooter;
