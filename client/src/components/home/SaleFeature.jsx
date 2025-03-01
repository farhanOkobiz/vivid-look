import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import ApiContext from "../baseapi/BaseApi";
import NewProductItem from "../productitem/NewProductItem";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const SaleFeature = () => {
  const baseApi = useContext(ApiContext); // Use context for base API URL

  const apiUrl = `${baseApi}/option`; // Fetch all products

  const [currentList, setCurrentList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  // console.log("mamon find the New Arrival product", currentList);

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(apiUrl);
  //     const fetchedProducts = response.data.data.doc; // Adjust according to API response structure

  //     console.log("mamon find the New Arrival product", fetchedProducts);

  //     // Remove duplicates based on product ID
  //     const uniqueProducts = [];
  //     const seenProductIds = new Set();
  //     fetchedProducts.forEach((item) => {
  //       if (!seenProductIds.has(item.product._id)) {
  //         seenProductIds.add(item.product._id);
  //         uniqueProducts.push(item);
  //       }
  //     });

  //     setCurrentList(uniqueProducts);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // console.log(currentList, "****");

  const fetchData = async () => {
    try {
      console.log("Fetching data from:", apiUrl);
      const response = await axios.get(apiUrl);
      console.log("API Response:", response.data);

      const fetchedProducts = response.data.data.doc || []; // Ensure it's an array
      console.log("Fetched Products:", fetchedProducts);

      if (!Array.isArray(fetchedProducts)) {
        throw new Error("Fetched data is not an array");
      }

      // Remove duplicates
      const uniqueProducts = [];
      const seenProductIds = new Set();
      fetchedProducts.forEach((item) => {
        if (item?.product?._id && !seenProductIds.has(item.product._id)) {
          seenProductIds.add(item.product._id);
          uniqueProducts.push(item);
        }
      });

      console.log("Unique Products:", uniqueProducts);
      setCurrentList(uniqueProducts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    console.log("Updated currentList:", currentList);
  }, [currentList]);

  // console.log("mamon find the currentList", currentList);

  return (
    <section className="py-6 font-inter px-3 2xl:px-0">
      <div>
        <div className="flex flex-wrap justify-between items-center pb-6">
          <div className="px-2">
            <h3 className="text-[24px] lg:text-5xl text-texthead mt-1 uppercase">
              New Arrival
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
              nextEl: ".swiper-button-next2",
              prevEl: ".swiper-button-prev2",
            }}
            breakpoints={{
              370: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1278: { slidesPerView: 4 },
            }}
            className="mySwiper w-full group-edit"
          >
            {currentList
              ?.filter(
                (item) =>
                  item?.product?.isActive &&
                  item?.category?.isActive &&
                  item?.subCategory?.isActive
              )
              .map((item, index) => (
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
          <motion.div className="swiper-button-next2 z-20 absolute rounded-full right-1 -top-10 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]">
            <FaChevronRight className="text-xs" />
          </motion.div>
          <motion.div className="swiper-button-prev2 absolute z-20 rounded-full right-14 -top-10 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]">
            <FaChevronLeft className="text-xs" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SaleFeature;
