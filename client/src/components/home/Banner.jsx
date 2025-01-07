import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/navigation";
import axios from "axios";
import ApiContext from "../baseapi/BaseApi";

const Banner = () => {
  const [bannerList, setBannerList] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const baseApi = useContext(ApiContext);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get(`${baseApi}/banner`);
        const banners = response.data.data.doc.filter(
          (item) => item?.bannerType === "Main Banner"
        );
        setBannerList(banners);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchBannerData();
  }, [baseApi]);

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.realIndex);
  };

  if (loading)
    return (
      <div className="mx-auto">
        <div className="relative banner-part animate-pulse">
          <div className="w-full h-[50vh] lg:h-[90vh] bg-[#646263] opacity-20"></div>
        </div>
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <section className="font-inter block">
        <div className="mx-auto">
          <section className="relative banner-part group">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={1}
              speed={1000}
              loop={true}
              autoplay={{ delay: 10000 }}
              pagination={{
                el: ".custom-pagination",
                clickable: true,
              }}
              navigation={{
                nextEl: ".next-button",
                prevEl: ".prev-button",
              }}
              onSlideChange={handleSlideChange}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 1 },
                1024: { slidesPerView: 1 },
              }}
              className="mySwiper"
            >
              {bannerList.map((item, i) => (
                <SwiperSlide key={item?._id}>
                  <div className="overflow-hidden relative">
                    {currentSlide === i && (
                      <div className="w-full h-[50vh] lg:h-[90vh]">
                        <motion.img
                          key={i}
                          className="w-full h-full object-cover 2xl:object-fit cursor-pointer"
                          src={item?.photo}
                          alt="banner"
                          onClick={() => navigate(item?.link)}
                        />
                        <div>
                          <div
                            onClick={() => navigate(item?.link)}
                            className="mt-12 px-5 md:px-10 py-1 md:py-2 cursor-pointer font-medium text-sm md:text-base rounded-md bg-black hover:bg-white text-white hover:text-black border-black border-2 transition-all ease-linear duration-200 absolute bottom-5 left-1/2 transform -translate-x-1/2 lg:bottom-32 lg:left-auto lg:right-32 lg:transform-none"
                          >
                            Shop Now
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 left-5 transform -translate-y-1/2 z-10 prev-button cursor-pointer text-white text-lg md:text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              ❮
            </div>
            <div className="absolute top-1/2 right-5 transform -translate-y-1/2 z-10 next-button cursor-pointer text-white text-lg md:text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              ❯
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default Banner;
