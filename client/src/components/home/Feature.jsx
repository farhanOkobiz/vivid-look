import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Containar from "../../layouts/Containar";
import { Link, useNavigate } from "react-router-dom";
import TitleHead from "../titlehead/TitleHead";
import { motion } from "framer-motion";
import ApiContext from "../baseapi/BaseApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
const Feature = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const baseApi = useContext(ApiContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseApi}/category`);
        const apiCategories = response.data.data.doc;

        // Log the fetched data for debugging
        // console.log("Fetched Categories:", apiCategories);

        // Set the fetched categories to state
        setCategories(apiCategories);
      } catch (error) {
        setError("Error fetching categories");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <section className="pt-14 lg:pt-14 font-inter px-5 2xl:px-0">
      <Containar>
        {/* <TitleHead titile="Shop Categories" subtitle="All Categories" /> */}
        <div className="px-2">
          <h3 className="lg:text-2xl text-[24px] xl:text-[24px] uppercase font-bold  text-texthead mt-1">
            All Categories
          </h3>
        </div>
        <motion.div className="my-10 relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            loop={true}
            speed={1000}
            autoplay={{ delay: 1000, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            navigation={{
              nextEl: ".swiper-button-next7",
              prevEl: ".swiper-button-prev7",
            }}
            breakpoints={{
              370: {
                slidesPerView: 2,
              },
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 5,
              },
              1280: {
                slidesPerView: 6,
              },
            }}
            className="mySwiper"
          >
            {categories.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="shadow bg-[#f6f6f6] mx-3 hover:bg-primary group duration-200">
                  <Link
                    // to={`/shop/category/${item?._id}`}
                    to={`/shop/category/${item?._id}/${encodeURIComponent(
                      item?.title.replace(/\s+/g, "")
                    )}`}
                    key={index}
                    className="w-[100%] "
                  >
                    <div className="flex items-center justify-center">
                      <img src={item.photos} alt={item.name} className="w-32" />
                    </div>
                    <h2 className="text-center lg:text-base xl:text-lg font-medium mt-5 pb-2 group-hover:text-white">
                      <span
                        onClick={() =>
                          navigate(
                            `/shop/category/${item?._id}/${encodeURIComponent(
                              item?.title.replace(/\s+/g, "")
                            )}`
                          )
                        }
                      >
                        {item?.title}
                      </span>
                    </h2>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            className={`rounded-full swiper-button-next7 absolute right-1 z-20  -top-16 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]`}
          >
            <FaChevronRight className="text-xs" />
          </div>
          <div
            className={`rounded-full swiper-button-prev7 absolute right-14 z-20   -top-16 -translate-y-1/2 w-10 h-10 border bg-white hover:bg-texthead transition-all ease-linear hover:text-white cursor-pointer hover:border-texthead border-[#b6b5b2] flex justify-center items-center text-[#858380]`}
          >
            <FaChevronLeft className="text-xs" />
          </div>
        </motion.div>
      </Containar>
    </section>
  );
};

export default Feature;
