import React, { useState, useEffect, useRef, useContext } from "react";
import Containar from "../../layouts/Containar";
import { Link } from "react-router-dom";
import ProductItem from "../productitem/ProductItem";
import { useInView, motion, useAnimation } from "framer-motion";
import ApiContext from "../baseapi/BaseApi";
import axios from "axios";
import { FaLuggageCart } from "react-icons/fa";
import NewProductItem from "../productitem/NewProductItem";
import bgback from "../../assets/banner/deal-shape.png";
import mainLogo from "../../assets/logos/logo.jpg";
const NewRelease = () => {
  const baseApi = useContext(ApiContext);
  const [currentList, setCurrentList] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [banners, setBanners] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsToShow, setProductsToShow] = useState(20); // State to control the number of products shown

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const animation = useAnimation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/category`);
        const categories = data.data.doc.slice(0, 4);
        setCategory(categories);

        if (categories.length > 0) {
          const firstCategoryId = categories[0]._id;
          setSelectedCategory(firstCategoryId);
          const { data: variantData } = await axios.get(
            `${baseApi}/category/${firstCategoryId}/options`
          );
          // setCurrentList(variantData.data?.options?.reverse().slice(0, 8));
          const fetchedProducts = variantData.data?.options; // Adjust according to API response structure

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
          const productsWithSizes = uniqueProducts?.map((product) => {
            const sizes = product.variant?.sizes || [];
            return {
              ...product,
              sizes, // Add sizes to the product object if needed
            };
          });

          setCurrentList(productsWithSizes.reverse().slice(0, 6));
          // console.log("currentList", currentList);
        }
      } catch (err) {
        setError("Error fetching categories");
        // console.error(err);
      }
    };

    fetchCategories();
  }, [baseApi]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get(`${baseApi}/banner`);
        const filteredBanners = data.data.doc.filter(
          (banner) => banner.bannerType === "New Release"
        );
        setBanners(filteredBanners.pop()); // Get the last banner
      } catch (err) {
        setError("Error fetching banners");
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [baseApi]);

  useEffect(() => {
    if (inView) {
      animation.start({
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration: 1,
          delay: 0.3,
          ease: "easeIn",
        },
      });
    }
  }, [inView, animation]);

  // console.log(category, ".....category");

  const handleSelect = async (id) => {
    setSelectedCategory(id);
    try {
      const { data } = await axios.get(`${baseApi}/category/${id}/options`);
      setCurrentList(data.data?.options);
      setProductsToShow(8);
    } catch (err) {
      setError("Error fetching category variants");
      // console.error(err);
    }
  };
  const handleViewMore = () => {
    setProductsToShow((prevCount) => prevCount + 8); // Show 20 more products
  };

  return (
    <>
      <section
        className="bg-[#F6F6F7] bg-no-repeat bg-cover lg:h-screen"
        style={{ background: `url(${bgback})` }}
      >
        <div className="bg-white h-full">
          {/* className="grid grid-cols-1 gap-x-5 mt-10 xl:grid-cols-4
              lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2" */}
          <div className="flex flex-col lg:flex-row mt-10 h-full w-full">
            <div className="lg:w-2/3 h-full">
              {banners && (
                <div className="border border-border h-full">
                  <div className="sticky top-5 h-full">
                    <Link to="/shop h-full">
                      <img
                        className="w-full h-full object-cover"
                        src={banners.photo}
                        alt="New Release"
                      />
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="lg:w-1/3 flex justify-center items-center">
              {productsToShow > currentList.length && (
                <div className="flex flex-col items-center">
                  <img
                    src={mainLogo}
                    alt=""
                    className="w-16 lg:w-32 h-16 lg:h-32 object-cover rounded-full"
                  />
                  <Link
                    to={"/shop"}
                    className="mt-5 px-5 lg:px-10 py-1 lg:py-2 cursor-pointer font-medium text-base rounded-md bg-primary hover:bg-white text-white hover:text-primary border-primary border-2 transition-all ease-linear duration-200"
                  >
                    Shop Now
                  </Link>
                </div>
              )}
            </div>
            {/* className="grid grid-cols-2 gap-y-2 lg:col-span-3 xl:grid-cols-4
                sm:grid-cols-2 h-auto" */}
          </div>
          {/* View More Button */}
        </div>
      </section>
    </>
  );
};

export default NewRelease;
