import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NewProductItem = ({
  image = [],
  product,
  title,
  regularprice,
  priceAfterDiscount,
  id,
  stock,
}) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    if (image.length > 1) {
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (image.length > 1) {
      setHovered(false);
    }
  };

  return (
    <motion.div className="flex flex-col justify-between overflow-hidden mx-2 2xl:mx-1 2xl:min-w-96">
      {stock > 0 ? (
        <Link to={`/productdetail/${product?.product?.slug}/${id}`} className="">
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="border group"
          >
            <div className="relative w-full  ">
              {/* First Image */}
              <img
                className={`w-full mx-auto transition-opacity duration-500 ease-in-out${
                  hovered && image.length > 1 ? "opacity-0" : "opacity-100"
                }`}
                src={image[0]}
                alt="product"
              />

              {/* Second Image (only if there are multiple images) */}
              {image.length > 1 && (
                <img
                  className={`w-full mx-auto transition-opacity duration-500 ease-in-out absolute top-0 left-0 ${
                    hovered ? "opacity-100" : "opacity-0"
                  }`}
                  src={image[1]}
                  alt="product"
                />
              )}
            </div>
          </div>
        </Link>
      ) : (
        <div className="overflow-hidden cursor-not-allowed">
          <div className="group">
            <img
              className="w-full object-cover mx-auto opacity-50"
              src={image[0]}
              alt="product"
            />
          </div>
        </div>
      )}
      <div className="flex flex-col justify-between mt-2">
        <div>
          <h2>
            <Link
              to={`/productdetail/${product?.product?.slug}/${id}`}
              className="leading-5 inline-block text-black mt-1 text-ellipsis overflow-hidden break-words"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {title}
            </Link>
          </h2>
          <div className="mt-2">
            <div className="flex items-center">
              <span className="font-semibold text-gray-900">
                <span className="mr-1">TK.</span>
                {priceAfterDiscount
                  ? Math.ceil(priceAfterDiscount)
                  : regularprice}
              </span>
              {priceAfterDiscount > 0 && (
                <span className="text-sm text-[#BD1E2D] line-through ml-2">
                  <span className="mr-1">৳</span>
                  {regularprice}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewProductItem;
