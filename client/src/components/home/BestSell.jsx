import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Containar from "../../layouts/Containar";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import ProductItem from "../productitem/ProductItem";
import { LuChevronRight } from "react-icons/lu";
import ApiContext from "../baseapi/BaseApi";
import { FaLuggageCart } from "react-icons/fa";
import NewProductItem from "../productitem/NewProductItem";

const BestSell = () => {
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();
  const baseApi = useContext(ApiContext);
  const [userProduct, setUserProduct] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await axios.get(`${baseApi}/varient`);

        const fetchedProducts = data?.data?.data?.doc; // Adjust according to API response structure

        // Remove duplicates based on product ID
        const uniqueProducts = [];
        const seenProductIds = new Set();
        fetchedProducts.forEach((item) => {
          if (!seenProductIds.has(item.product._id)) {
            seenProductIds.add(item.product._id);
            uniqueProducts.push(item);
          }
        });

        // Collect all sizes for each product
        const productsWithSizes = uniqueProducts.map((product) => {
          const sizes = product.variant?.sizes || [];
          return {
            ...product,
            sizes, // Add sizes to the product object if needed
          };
        });

        setProductList(productsWithSizes);
        // console.log(response.data.data.doc);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // console.log("list", productList);
  return (
    <section className="py-4 font-inter px-3 2xl:px-0 bg-[#F6F6F7]">
      {/* <Containar> */}
        <div>
          <div className="flex flex-wrap justify-between items-center pb-3">
            <div className="px-2">
              {/* <p className="flex items-center gap-2 text-[#E53E3E] text-sm">
                <FaLuggageCart className="bg-[#E53E3E] font-bold text-2xl p-1 rounded-full text-white" />
                This Month
              </p> */}
              <h3 className="text-[24px] mr-3 lg:text-5xl text-texthead mt-1 uppercase">
                Best Selling
              </h3>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 2 }}
            className="w-full relative"
          >
            <Swiper
              modules={[Navigation, Autoplay]}
              slidesPerView={1}
              loop={true}
              speed={1000}
              autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
              navigation={{
                nextEl: ".swiper-button-next1",
                prevEl: ".swiper-button-prev1",
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                370: { slidesPerView: 2 },
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 3 },
                1278: { slidesPerView: 4 },
              }}
              className="mySwiper w-full group-edit"
            >
              {productList.map((item, index) => (
                <SwiperSlide key={index}>
                  <NewProductItem
                    key={item?._id}
                    product={item}
                    image={item?.product?.photos}
                    id={item?.product?._id}
                    subtitle={item?.brand?.title}
                    title={item?.product?.name}
                    categoryId={item?.category?._id}
                    brandId={item?.brand?._id}
                    categoryName={item?.category?.title}
                    discount={item?.discountValue}
                    discountType={item?.discountType}
                    discountPercent={item?.discountPercent}
                    priceAfterDiscount={item?.salePrice}
                    offerprice={item?.price - item?.discount}
                    freeShipping={item?.freeShipping}
                    regularprice={item?.price}
                    stock={item?.stock}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <motion.div
              // whileHover={{ scale: 1.2 }}
              // whileTap={{ scale: 1.1 }}
              className="swiper-button-next1 z-20 absolute rounded-full right-1  -top-20 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]"
            >
              <FaChevronRight className="text-xs" />
            </motion.div>
            <motion.div
              // whileHover={{ scale: 1.2 }}
              // whileTap={{ scale: 1.1 }}
              className="swiper-button-prev1 absolute z-20 rounded-full right-14  -top-20 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]"
            >
              <FaChevronLeft className="text-xs" />
            </motion.div>
          </motion.div>

          {/* <div className="flex justify-center">
            <Link
              to={"/shop/mega-sale"}
              className="mt-12 px-10 py-2 cursor-pointer font-medium text-base rounded-md bg-primary hover:bg-white text-white hover:text-primary border-primary border-2 transition-all ease-linear duration-200"
            >
              Show All
            </Link>
          </div> */}
        </div>
      {/* </Containar> */}
    </section>
  );
};

export default BestSell;
