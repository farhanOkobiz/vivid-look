import React, { useContext, useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper/modules";
import Containar from "../layouts/Containar";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdCheckCircleOutline } from "react-icons/md";
import { LiaHandsHelpingSolid } from "react-icons/lia";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { socialList } from "../components/constants";
import RelatedProduct from "../components/productdetails/RelatedProduct";
import ParagraphtoList from "../components/productdetails/ParagraphtoList";
import axios from "axios";
import { addToCart } from "../redux/slices/cartSlices";
import RightPartProduct from "../components/productdetails/RightPartProduct";
import ApiContext from "../components/baseapi/BaseApi";
import youtube from "../../src/assets/productdetails/youtube.png";
import { IoCartOutline } from "react-icons/io5";
import { RiShoppingBag2Fill } from "react-icons/ri";
const serviceList = [
  {
    icon: TbTruckDelivery,
    title: "Fast Delivery",
    // details: "Orders over $100",
  },
  {
    icon: RiSecurePaymentLine,
    title: "Secure Payment",
    details: "100% Secure Payment",
  },
  {
    icon: MdCheckCircleOutline,
    title: "Money Back Guarantee",
    // details: "Within 30 Days",
  },
  {
    icon: LiaHandsHelpingSolid,
    title: "24/7 Support",
    details: "Within 1 Business Day",
  },
];

const ProductDetail = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userChoice, setUserChoiceColor] = useState("");
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const baseApi = useContext(ApiContext);
  const { slug, id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseApi}/product/${id}`);
        const productData = response.data.data.doc;
        setData(productData);

        // console.log(productData, "........................");

        if (productData.variants && productData.variants.length > 0) {
          const firstValidVariant = productData.variants.find(
            (variant) => variant.options && variant.options.length > 0
          );

          if (firstValidVariant) {
            setSelectedColor(firstValidVariant);
            setUserChoiceColor(firstValidVariant.colorCode);
            setSelectedSize(firstValidVariant.options[0].size);
          }
        }

        // const hasReloaded = sessionStorage.getItem("hasReloaded");
        // if (!hasReloaded) {
        //   sessionStorage.setItem("hasReloaded", "true");
        //   window.location.reload();
        // }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const totalStock = data?.variants?.reduce((total, variant) => {
    const optionsStock = variant.options?.reduce(
      (optionTotal, option) => optionTotal + (option.stock || 0),
      0
    );
    return total + (optionsStock || 0);
  }, 0);

  const handleAddToCart = () => {
    const selectedOption = selectedColor?.options.find(
      (option) => option.size === selectedSize
    );

    const item = {
      ...data,
      id,
      quantity,
      colorOptionId: selectedOption?._id,
      selectedOption,
      selectedColor,
    };

    dispatch(addToCart(item));
    setQuantity(1);
  };

  const handleSelectColorChange = (color) => {
    setUserChoiceColor(color);
  };

  const handleColorChange = (variant) => {
    setSelectedColor(variant);
    setUserChoiceColor(variant.colorCode);

    if (variant.options && variant.options.length > 0) {
      setSelectedSize(variant.options[0].size);
    }
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const renderSizes = () => {
    if (!selectedColor || !selectedColor.options) {
      return null;
    }

    return selectedColor.options.map((option) => (
      <button
        key={option._id}
        onClick={() => handleSizeChange(option.size)}
        className={`${
          selectedSize === option.size
            ? "bg-texthead text-white"
            : "bg-gray-200"
        } px-2 py-1 rounded text-sm mx-2`}
      >
        {option.size}
      </button>
    ));
  };

  const renderPrice = () => {
    let selectedOption;

    // If a size is selected, find the option with that size
    if (selectedSize) {
      selectedOption = selectedColor?.options?.find(
        (option) => option?.size === selectedSize
      );
    } else {
      // If no size is selected, use the first available option
      selectedOption = selectedColor?.options?.[0];
    }

    // If a selectedOption exists, display the price
    if (selectedOption) {
      return (
        <div>
          {selectedOption?.salePrice ? (
            <div className="flex text-2xl items-center gap-x-1 text-green-600">
              ৳ {parseInt(selectedOption?.salePrice)}
              <div className="flex text-xl items-center gap-x-0.5 text-red-500 line-through">
                {parseInt(selectedOption?.price)} tk
              </div>
            </div>
          ) : (
            <div className="flex text-2xl items-center gap-x-1 text-green-600">
              ৳ {parseInt(selectedOption?.price)}
            </div>
          )}
        </div>
      );
    }

    // If no selectedOption is found, fallback to a default price (you can return an error message or fallback logic here)
    return <p>Price not available</p>;
  };

  const renderDiscount = () => {
    if (selectedSize) {
      const selectedOption = selectedColor?.options?.find(
        (option) => option?.size === selectedSize
      );

      if (selectedOption) {
        return (
          <>
            <div className="absolute right-4 top-12 z-10">
              {selectedOption?.freeShipping && (
                <h3 className="px-3 bg-green-600 text-white py-1 shadow-xl rounded-md">
                  Free Shipping
                </h3>
              )}
            </div>

            {selectedOption?.discountValue > 0 && (
              <div className="absolute left-0 top-12 z-10">
                <h3 className="px-3 bg-danger text-white py-1 shadow-xl ">
                  {selectedOption?.discountType == "percent" ? (
                    <>{selectedOption?.discountValue} %</>
                  ) : (
                    <> ৳ {selectedOption?.discountValue} </>
                  )}
                </h3>
              </div>
            )}
          </>
        );
      }
    }
  };

  const renderDetails = () => {
    if (selectedColor?.details?.length > 0) {
      return <ParagraphtoList paragraph={selectedColor?.details} />;
    }
  };

  const photos = data?.photos || [];

  const isYouTubeLink = (url) => {
    return (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("youtube.com/shorts")
    );
  };

  const handleMouseEnter = (swiper) => {
    swiper.autoplay.stop();
  };

  const handleMouseLeave = (swiper) => {
    swiper.autoplay.start();
  };

  const handleSeeMoreClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Function to truncate description to a certain word limit
  const truncateDescription = (description, wordLimit = 30) => {
    if (!description) return "";
    const words = description.split(" ");
    if (words.length <= wordLimit) return description;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    // Handle YouTube Shorts links
    if (url.includes("youtube.com/shorts/")) {
      return url.split("shorts/")[1];
    }

    // Handle regular YouTube watch links
    if (url.includes("youtube.com/watch?v=")) {
      return url.split("v=")[1]?.split("&")[0];
    }

    // Handle youtu.be links (shortened YouTube links)
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1];
    }

    return null; // Return null if the URL is not a valid YouTube link
  };

  const descriptionText = data?.description;
  const isLongDescription =
    descriptionText && descriptionText.split(" ").length > 30;
  return (
    <>
      <section className="border-b border-b-border px-5 xl:px-0">
        <Containar>
          <div className="px-4">
            <h4 className="flex flex-wrap items-center gap-x-2 text-sm py-7">
              <span className="cursor-pointer hover:text-[#ef4444] text-texthead transition-all ease-linear duration-200">
                <Link to={"/"}>Home</Link>
              </span>{" "}
              <span>
                <FaChevronRight className="w-[5px] mt-0.5" />
              </span>{" "}
              <Link
                className="hover:text-[#ef4444] text-texthead transition-all ease-linear duration-200"
                to={"/shop"}
              >
                Shop
              </Link>{" "}
              <span>
                <FaChevronRight className="w-[5px] mt-0.5" />
              </span>{" "}
              <span>{data?.name}</span>
            </h4>
          </div>
        </Containar>
      </section>

      <section className="font-inter pt-10 xl:pt-16 bg-[#F2F3F8]">
        <div className=" mx-auto sm:px-10 xl:px-20">
          <div className="bg-white rounded">
            {loading ? (
              <div className="animate-pulse flex flex-wrap justify-between ">
                <div className="w-full relative md:w-[50%] lg:w-[50%] xl:w-[40%] bg-gray-200 h-[590px] rounded-lg mb-4"></div>

                <div className="w-full md:w-[45%] lg:w-[45%] xl:w-[55%] px-5 lg:px-0">
                  <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex gap-x-3 mt-4 md:mt-10">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mt-6 md:mt-10"></div>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex mt-10 gap-x-8">
                    <div className="h-[60px] w-24 bg-gray-200 rounded"></div>
                    <div className="h-[60px] w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-5 flex-col md:flex-row xl:gap-14 p-5 xl:p-10">
                <div className="w-full relative md:w-[40%] lg:w-[50%] xl:w-[40%] product_Details">
                  {renderDiscount()}
                  <PhotoProvider>
                    {photos.length > 0 && (
                      <>
                        <Swiper
                          style={{
                            "--swiper-navigation-color": "#fff",
                            "--swiper-navigation-size": "25px",
                          }}
                          loop={true} // Ensures the swiper loops
                          spaceBetween={10}
                          navigation={true}
                          thumbs={{ swiper: thumbsSwiper }}
                          modules={[FreeMode, Navigation, Thumbs, Autoplay]} // Add Autoplay module
                          autoplay={{
                            delay: 2500,
                            disableOnInteraction: true,
                          }}
                          className="mySwiper2 w-full max-h-[590px] flex"
                          onSwiper={(swiper) =>
                            (window.swiperInstance = swiper)
                          }
                        >
                          {photos
                            .filter((item) => !isYouTubeLink(item)) // Filter out YouTube links
                            .slice(0, 5) // Show only the first 5 images
                            .map((item, index) => (
                              <SwiperSlide
                                key={index}
                                onTouchStart={() => {
                                  if (window.swiperInstance?.autoplay) {
                                    window.swiperInstance.autoplay.stop();
                                  }
                                }}
                                onTouchEnd={() => {
                                  if (window.swiperInstance?.autoplay) {
                                    window.swiperInstance.autoplay.start();
                                  }
                                }}
                                onMouseEnter={() => {
                                  if (window.swiperInstance?.autoplay) {
                                    window.swiperInstance.autoplay.stop();
                                  }
                                }}
                                onMouseLeave={() => {
                                  if (window.swiperInstance?.autoplay) {
                                    window.swiperInstance.autoplay.start();
                                  }
                                }}
                              >
                                <PhotoView src={item}>
                                  <img
                                    className="w-full object-contain"
                                    src={item}
                                    alt={`Image ${index}`}
                                  />
                                </PhotoView>
                              </SwiperSlide>
                            ))}
                        </Swiper>

                        <Swiper
                          onSwiper={setThumbsSwiper}
                          loop={true}
                          slidesPerView={4}
                          freeMode={true}
                          watchSlidesProgress={true}
                          modules={[FreeMode, Navigation, Thumbs]}
                          className="mySwiper max-h-[180px]"
                        >
                          {photos
                            .filter((item) => !isYouTubeLink(item)) // Filter out YouTube links
                            .slice(0, 5) // Show only the first 5 images
                            .map((item, index) => (
                              <SwiperSlide key={index}>
                                <img
                                  className="w-full object-contain"
                                  src={item}
                                  alt={`Thumbnail ${index}`}
                                />
                              </SwiperSlide>
                            ))}
                        </Swiper>
                      </>
                    )}
                  </PhotoProvider>
                </div>

                <div className="w-full ">
                  <h1 className="text-xl font-semibold">{data?.name}</h1>

                  <p className="text-gray-500 mt-1 border-b pb-5">
                    {descriptionText && descriptionText !== "undefined" && (
                      <>
                        <p>
                          {isLongDescription && !isExpanded
                            ? truncateDescription(descriptionText, 30)
                            : descriptionText}
                        </p>
                        {isLongDescription && (
                          <button
                            onClick={handleSeeMoreClick}
                            className="text-blue-500 hover:underline mt-2 underline text-sm"
                          >
                            {isExpanded ? "See Less" : "See More"}
                          </button>
                        )}
                      </>
                    )}
                  </p>

                  <div className="mt-4 text-2xl border-b pb-5 flex">
                    <p className="text-gray-400 mr-2 text-sm w-[20%]">Price:</p>
                    {renderPrice()}
                  </div>

                  {/* <div className="mt-4 text-2xl border-b pb-5 flex">
                      <p className="text-gray-400 mr-2 text-sm w-[20%]">
                        Price:
                      </p>
                      {renderPrice()}
                    </div> */}
                  <div>
                    {data.variants?.length > 0 &&
                      data.variants[0].colorCode &&
                      data?.variants[0].colorName &&
                      data.variants.some(
                        (variant) => variant.options?.length > 0
                      ) && (
                        <div className="flex items-center">
                          <h3 className="text-gray-400 mr-2 text-sm w-[20%] mt-4  pb-5">
                            {data?.variants.length > 0 ? "Colors:" : ""}
                          </h3>

                          <ul className="mt-4 flex flex-wrap gap-2">
                            {data.variants
                              .filter((variant) => variant.options?.length > 0)
                              .map((item, index) => (
                                <li
                                  onClick={() => {
                                    handleColorChange(item);
                                    handleSelectColorChange(item.colorCode);
                                  }}
                                  key={index}
                                >
                                  <button
                                    style={{
                                      backgroundColor: item.colorCode,
                                    }}
                                    className={`w-8 h-8 text-sm ${
                                      userChoice === item.colorCode
                                        ? "shadow-2xl border-[1px] border-gray-700 rounded-full "
                                        : "bg-gray-200 border-[1px] border-gray-200 rounded-full text-texthead"
                                    }`}
                                  ></button>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                  </div>

                  {data?.variants[0]?.options[0]?.size && (
                    // <div className="mt-4 text-2xl border-b pb-5 flex">
                    //   <p className="text-gray-400 mr-2 text-sm w-[20%]">
                    //     {parseInt(data?.variants[0]?.options[0]?.size)
                    //       ? "Quantity:"
                    //       : "Sizes:"}
                    //   </p>
                    //   {renderSizes()}
                    // </div>

                    <div className="mt-4 text-2xl border-b pb-5 flex">
                      <p className="text-gray-400 mr-2 text-sm w-[20%]">
                        {" "}
                        {parseInt(data?.variants[0].options[0].size)
                          ? "Sizes:"
                          : "Sizes:"}
                      </p>

                      {renderSizes()}
                    </div>
                  )}

                  <div className="flex items-center mt-4 border-b pb-5">
                    <p className="text-gray-400 mr-2 text-sm w-[20%]">
                      Quantity:
                    </p>
                    <div className="h-full border hidden lg:flex border-border">
                      <button
                        onClick={() => {
                          if (quantity > 1) {
                            setQuantity(quantity - 1);
                            setError("");
                          }
                        }}
                        className="w-[60px] h-full flex items-center cursor-pointer justify-center"
                        disabled={quantity === 1}
                      >
                        <span className="w-10 h-10 text-3xl bg-gray-200">
                          -
                        </span>
                      </button>
                      <div className="flex items-center justify-center">
                        {quantity}
                      </div>
                      <button
                        onClick={() => {
                          if (quantity < totalStock) {
                            setQuantity(quantity + 1);
                            setError("");
                          } else {
                            setError("Cannot exceed available stock!");
                          }
                        }}
                        className="w-[60px] h-full flex items-center justify-center"
                      >
                        <span className="w-10 h-10 text-3xl bg-gray-200">
                          +
                        </span>
                      </button>
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                    <span className="ml-2 text-gray-500">
                      <p>({totalStock} available)</p>
                      {/* (200 available) */}
                    </span>
                  </div>

                  <div className="hidden mt-6 lg:flex gap-4 z-10">
                    <button
                      onClick={() => handleAddToCart(data)}
                      className="px-3 py-2 rounded flex items-center gap-2 bg-primary hover:bg-white duration-200 text-white hover:text-black border-2 border-black"
                    >
                      <RiShoppingBag2Fill /> Add to cart
                    </button>
                    <button
                      onClick={() => {
                        handleAddToCart(data);
                        navigate("/checkout");
                        // console.log(data);
                      }}
                      className="hover:bg-black bg-white hover:text-white text-black px-3 py-2 rounded flex items-center gap-2 duration-200 border-2 border-black"
                    >
                      <IoCartOutline /> Order Now
                    </button>
                  </div>

                  <div className="mt-10 lg:mt-20 flex gap-4 items-center">
                    <p className="text-gray-400 mr-2 text-sm w-[20%]">
                      Social Media:
                    </p>
                    {socialList.map((item, index) => {
                      let Icon = item.logo;
                      const bgColor =
                        item.name === "facebook"
                          ? "bg-[#3b5998] hover:bg-opacity-70"
                          : item.name === "instagram"
                          ? "bg-[#DC1E66] hover:bg-opacity-70"
                          : item.name === "youtube"
                          ? "bg-[#DC1E66] hover:bg-opacity-70"
                          : item.name === "whatsapp"
                          ? "bg-[#075E54] hover:bg-opacity-70"
                          : item.name === "tiktok"
                          ? "bg-[#69C9D0] hover:bg-opacity-70"
                          : "";
                      return (
                        <Link
                          key={index}
                          className="text-texthead"
                          to={item.link}
                        >
                          <li
                            className={`w-10 h-10 rounded-full flex items-center text-white justify-center border border-border ${bgColor} transition-all ease-linear duration-200 hover:text-white`}
                            key={index}
                          >
                            <Icon />
                          </li>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="flex lg:hidden z-10 fixed md:static bottom-0 w-full justify-center items-center gap-x-2">
              <div className="h-full flex z-[100]">
                <button
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity(quantity - 1);
                      setError("");
                    }
                  }}
                  className="w-[60px] h-full flex items-center cursor-pointer justify-center"
                  disabled={quantity === 1}
                >
                  <span className="w-10 h-10 text-3xl bg-gray-200">-</span>
                </button>
                <div className="flex items-center justify-center w-full bg-white">
                  {quantity}
                </div>
                <button
                  onClick={() => {
                    if (quantity < totalStock) {
                      setQuantity(quantity + 1);
                      setError("");
                    } else {
                      setError("Cannot exceed available stock!");
                    }
                  }}
                  className="w-[60px] h-full flex items-center justify-center"
                >
                  <span className="w-10 h-10 text-3xl bg-gray-200">+</span>
                </button>
              </div>
              <button
                onClick={() => {
                  handleAddToCart(data);
                  navigate("/checkout");
                }}
                style={{
                  animation: "zoom 1s ease-in-out infinite",
                }}
                className="hover:bg-black bg-white hover:text-white text-black p-2 flex items-center gap-2 duration-200 border-2 border-black font-bold text-sm"
              >
                <IoCartOutline /> Buy it now
              </button>
              <button
                onClick={() => handleAddToCart(data)}
                className="p-2 flex items-center gap-2 bg-primary hover:bg-white duration-200 text-white hover:text-black border-2 border-black font-bold text-sm"
              >
                <RiShoppingBag2Fill /> Add to cart
              </button>
            </div>
          </div>
        </div>
        <Containar>
          <div className="flex gap-5 my-10">
            <div className="w-[25%] mb-10 hidden lg:block">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ) : (
                <ul>
                  <RightPartProduct />
                  <li className="mt-8 flex flex-wrap lg:block  bg-white  shadow rounded">
                    {serviceList.map((item, index) => {
                      let Icon = item.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-x-2 xl:gap-x-5 border-b py-5 w-full sm:w-[50%] lg:w-full px-2 xl:px-[30px]"
                        >
                          <h2 className="text-5xl text-secendary">
                            <Icon />
                          </h2>
                          <div>
                            <h3 className="text-sm  text-texthead font-medium">
                              {item?.title}
                            </h3>
                            <p>{item?.details}</p>
                          </div>
                        </div>
                      );
                    })}
                  </li>
                </ul>
              )}
            </div>
            <div className="w-full lg:w-[75%] bg-white shadow rounded">
              <div>
                {selectedColor?.details?.length > 0 && (
                  <div>
                    <h2 className="text-xl font-medium text-texthead border-b p-5 bg-gray-200">
                      Product Details
                    </h2>
                    <div className="p-5">{renderDetails()}</div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4 items-center mt-8">
                {/* Render all video links first */}
                {photos
                  .filter((item) => isYouTubeLink(item)) // Filter only YouTube links
                  .map((item, index) => (
                    <div key={index} className="w-full lg:w-1/2">
                      <div className="relative aspect-video rounded-md shadow-md overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                            item
                          )}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`YouTube Video ${index + 1}`}
                          className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                      </div>
                    </div>
                  ))}

                {/* Render images after the 5th index */}
                {photos
                  .slice(5) // Start from the 5th index
                  .filter((item) => !isYouTubeLink(item)) // Filter out YouTube links
                  .map((item, index) => (
                    <div key={index} className="w-full lg:w-1/2">
                      <img
                        src={item}
                        alt={`Photo ${index + 6}`} // Adjust index to start from 6
                        className="w-full object-cover rounded-md shadow-md"
                      />
                    </div>
                  ))}
              </div>

              <RelatedProduct id={data?.category?._id} />
            </div>
          </div>
        </Containar>
      </section>
    </>
  );
};

export default ProductDetail;
