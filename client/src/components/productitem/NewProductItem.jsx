import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlices";
import axios from "axios";
import ApiContext from "../baseapi/BaseApi";
import { FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import SkeletonLoader from "../skeletonLoader/SkeletonLoader";
import { motion } from "framer-motion";

const NewProductItem = ({
  image = [],
  product,
  discount,
  subtitle,
  title,
  categoryName,
  offerprice,
  regularprice,
  classItem,
  categoryId,
  brandId,
  discountType,
  discountPercent,
  priceAfterDiscount,
  id,
  slug,
  freeShipping,
  achieveSizes,
  stock,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalCart, setShowModalCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null); // State for selected size
  const modalRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
        setShowModalCart(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  return (
    <>
      <motion.div className="flex flex-col justify-between overflow-hidden mx-1 min-h-[400px] lg:min-w-96">
        {stock > 0 ? (
          <Link
            to={`/productdetail/${product?.product?.slug}/${id}`}
            className="h-full"
          >
            <div
              onMouseEnter={() => image.length > 1 && setHovered(true)}
              onMouseLeave={() => image.length > 1 && setHovered(false)}
              className="border overflow-hidden group relative h-full"
            >
              <div
                className={`relative w-full ${
                  isHomePage ? "h-[300px] lg:h-[700px]" : "h-full"
                }`}
              >
                {/* First Image */}
                <img
                  className={`w-full h-full mx-auto transition-opacity duration-500 ease-in-out absolute top-0 left-0 ${
                    hovered && image.length > 1 ? "opacity-0" : "opacity-100"
                  }`}
                  src={image[0]}
                  alt="product"
                />

                {/* Second Image (only if there are multiple images) */}
                {image.length > 1 && (
                  <img
                    className={`w-full h-full mx-auto transition-opacity duration-500 ease-in-out absolute top-0 left-0 ${
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
                className="w-full object-cover mx-auto opacity-50 h-[500px]"
                src={image[0]}
                alt="product"
              />
            </div>
          </div>
        )}
        <div className="flex flex-col justify-between">
          <div className="">
            <h2 className="">
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
    </>
  );
};

export default NewProductItem;
