import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams
import ApiContext from "../components/baseapi/BaseApi";

const SubCategoryPage = () => {
  const { categoryId } = useParams();
  const [subcategories, setSubCategories] = useState([]);
  const [categoriesDetails, setCategoriesDetails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseApi = useContext(ApiContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseApi}/category/${categoryId}`);
        const apiCategories = response.data.data.doc;

        // Set the fetched categories to state
        setCategoriesDetails(apiCategories);
        setSubCategories(apiCategories.subCategories);
      } catch (error) {
        setError("Error fetching categories");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [baseApi, categoryId]);

  return (
    <div>
      {/* Display loading or error state */}
      {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {/* Full-screen banner */}
      {/* <div
        className="h-screen w-full bg-center bg-no-repeat text-white text-2xl font-bold"
        style={{ backgroundImage: `url(${categoriesDetails?.photos})` }}
      ></div> */}
      <img src={categoriesDetails?.photos} alt="" className="w-full h-[50vh] md:h-[90vh] object-cover md:object-fill"/>

      {/* Subcategories in grid layout */}
      <div className="subcategories-grid p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subcategories.map((subcategory, index) => (
            // <div
            //   key={index}
            //   className="subcategory-card border rounded-lg shadow-lg bg-white"
            // >
            //   <img
            //     src={subcategory.photos}
            //     alt={subcategory.title}
            //     className="w-full h-48 object-cover rounded-t-lg"
            //   />
            //   <div className="p-4">
            //     <h3 className="text-lg font-bold mb-2">{subcategory.title}</h3>
            //     <p className="text-sm text-gray-600">{subcategory.description}</p>
            //   </div>
            // </div>
            <div
              key={index}
              className="relative shadow bg-[#f6f6f6] group duration-200 h-[400px] overflow-hidden"
            >
              <Link
                key={index}
                to={`/shop/subcategory/${subcategory?._id}/${encodeURIComponent(
                  subcategory?.title?.replace(/\s+/g, "")
                )}`}
                className="w-full h-full block relative"
              >
                {/* Black Overlay */}
                <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

                {/* Image */}
                <div className="flex items-center justify-center h-full w-full">
                  <img
                    src={subcategory.photos}
                    alt={subcategory.name}
                    className="h-full w-full object-fit"
                  />
                </div>

                {/* Title */}
                <h2 className="absolute inset-0 flex items-center justify-center text-center lg:text-base xl:text-[40px] pb-2 z-10 text-white">
                  <span>{subcategory?.title}</span>
                </h2>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryPage;
