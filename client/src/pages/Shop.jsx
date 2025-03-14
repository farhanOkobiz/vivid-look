// import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import ProductItem from "../components/productitem/ProductItem";
// import ApiContext from "../components/baseapi/BaseApi";
// import { useSelector, useDispatch } from "react-redux";
// import { useLocation } from "react-router-dom";
// import { resetColor } from "../redux/slices/colorSlice";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
// import SkeletonLoader from "../components/skeletonLoader/SkeletonLoader";
// import NewProductItem from "../components/productitem/NewProductItem";

// const Shop = () => {
//   const baseApi = useContext(ApiContext);
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const [allProduct, setAllProduct] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const productsPerPage = 20;
//   const { minPrice, maxPrice } = useSelector((state) => state.priceRange);
//   const selectedSortOption = useSelector(
//     (state) => state.sort.selectedSortOption
//   );
//   const selectedColor = useSelector((state) => state.colors.selectedColor);

//   console.log("mamon try to find allProduct", allProduct);

//   const getSortParameter = () => {
//     switch (selectedSortOption) {
//       case "popularity":
//         return "-visitCount";
//       case "low-to-high":
//         return "price";
//       case "discount":
//         return "-discount";
//       case "high-to-low":
//         return "-price";
//       case "discount-percent":
//         return "-discountPercent";
//       case "latest":
//       default:
//         return null;
//     }
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const sortParam = getSortParameter();
//       const params = {
//         "price[lt]": maxPrice,
//         "price[gt]": minPrice,
//         ...(sortParam && { sort: sortParam }),
//       };

//       const response = await axios.get(`${baseApi}/option`, { params });
//       const fetchedProducts = response.data.data.doc;

//       console.log("mamon try to find fetchedProducts", fetchedProducts);

//       // Remove duplicates based on product ID
//       const uniqueProducts = [];
//       const seenProductIds = new Set();
//       fetchedProducts.forEach((item) => {
//         if (!seenProductIds.has(item.product._id)) {
//           seenProductIds.add(item.product._id);
//           uniqueProducts.push(item);
//         }
//       });

//       // Collect all sizes for each product
//       const productsWithSizes = uniqueProducts.map((product) => {
//         const sizes = product.variant?.sizes || [];
//         return {
//           ...product,
//           sizes, // Add sizes to the product object if needed
//         };
//       });

//       // Filter products by selected color
//       const filteredProducts = selectedColor
//         ? productsWithSizes.filter(
//             (product) =>
//               product.variant?.colorName.toLowerCase() ===
//               selectedColor.toLowerCase()
//           )
//         : productsWithSizes;

//       setAllProduct(filteredProducts);
//       setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));
//       setCurrentPage(1);
//     } catch (err) {
//       setError("Failed to load products. Please try again later.");
//       console.error("Error fetching products:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [baseApi, minPrice, maxPrice, selectedSortOption, selectedColor]);

//   useEffect(() => {
//     dispatch(resetColor());
//   }, [location.pathname, dispatch]);

//   const handlePageChange = (page) => {
//     if (page > 0 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//       pageNumbers.push(i);
//     }
//     return pageNumbers;
//   };

//   const paginatedProducts = allProduct.slice(
//     (currentPage - 1) * productsPerPage,
//     currentPage * productsPerPage
//   );

//   console.log("This is all product", paginatedProducts);
//   return (
//     <div>
//       <div className="grid grid-cols-1 gap-y-4 xl:gap-6 mt-4 md:grid-cols-3 lg:grid-cols-4">
//         {loading ? (
//           <SkeletonLoader />
//         ) : error ? (
//           <div>{error}</div>
//         ) : paginatedProducts.length === 0 ? (
//           <div>No products available.</div>
//         ) : (
//           paginatedProducts
//             .filter(
//               (item) =>
//                 item?.product?.isActive &&
//                 item?.category?.isActive &&
//                 item?.subCategory?.isActive
//             )
//             .map((item) => (
//               <NewProductItem
//                 key={item?.product?._id}
//                 product={item}
//                 image={item?.product?.photos}
//                 id={item?.product?._id}
//                 subtitle={item?.brand?.title}
//                 title={item?.product?.name}
//                 categoryId={item?.category?._id}
//                 brandId={item?.brand?._id}
//                 categoryName={item?.category?.title}
//                 discount={item?.discountValue}
//                 discountType={item?.discountType}
//                 discountPercent={item?.discountPercent}
//                 priceAfterDiscount={item?.salePrice}
//                 offerprice={item?.price - item?.discount}
//                 freeShipping={item?.freeShipping}
//                 regularprice={item?.price}
//                 classItem=""
//                 stock={item?.stock}
//               />
//             ))
//         )}
//       </div>

//       {/* {totalPages > 1 && (
//         <PaginationControls
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={handlePageChange}
//           getPageNumbers={getPageNumbers}
//         />
//       )} */}
//     </div>
//   );
// };

// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   onPageChange,
//   getPageNumbers,
// }) => {
//   const pageNumbers = getPageNumbers();

//   return (
//     <div className="flex items-center justify-center mt-28 space-x-2">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className={`w-10 h-10 border rounded-full flex items-center justify-center  ${
//           currentPage === 1
//             ? "bg-gray-300 text-gray-500"
//             : "bg-texthead text-white hover:bg-red-500"
//         } transition-colors`}
//       >
//         <FaChevronLeft />
//       </button>
//       {pageNumbers.map((number) => (
//         <button
//           key={number}
//           onClick={() => onPageChange(number)}
//           className={`w-10 h-10 border rounded-full flex items-center justify-center ${
//             number === currentPage
//               ? "bg-red-500 text-white"
//               : "bg-white text-texthead hover:bg-red-100"
//           } transition-colors`}
//         >
//           {number}
//         </button>
//       ))}
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className={`w-10 h-10 border rounded-full flex items-center justify-center ${
//           currentPage === totalPages
//             ? "bg-gray-300 text-gray-500"
//             : "bg-texthead text-white hover:bg-red-500"
//         } transition-colors`}
//       >
//         <FaChevronRight />
//       </button>
//     </div>
//   );
// };

// export default Shop;

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import ProductItem from "../components/productitem/ProductItem";
import ApiContext from "../components/baseapi/BaseApi";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { resetColor } from "../redux/slices/colorSlice";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import SkeletonLoader from "../components/skeletonLoader/SkeletonLoader";
import NewProductItem from "../components/productitem/NewProductItem";
import PaginationControls from "./PaginationControls";

const Shop = () => {
  const baseApi = useContext(ApiContext);
  const dispatch = useDispatch();
  const location = useLocation();
  const [allProduct, setAllProduct] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 20;
  const { minPrice, maxPrice } = useSelector((state) => state.priceRange);
  const selectedSortOption = useSelector(
    (state) => state.sort.selectedSortOption
  );
  const selectedColor = useSelector((state) => state.colors.selectedColor);

  console.log("Checking allProduct data:", allProduct);

  const getSortParameter = () => {
    switch (selectedSortOption) {
      case "popularity":
        return "-visitCount";
      case "low-to-high":
        return "price";
      case "discount":
        return "-discount";
      case "high-to-low":
        return "-price";
      case "discount-percent":
        return "-discountPercent";
      case "latest":
      default:
        return null;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const sortParam = getSortParameter();
      const params = {
        "price[lt]": maxPrice,
        "price[gt]": minPrice,
        ...(sortParam && { sort: sortParam }),
      };

      const response = await axios.get(`${baseApi}/option`, { params });
      console.log("Full API response:", response.data);
      const fetchedProducts = response.data.data?.doc || [];

      const uniqueProducts = [];
      const seenProductIds = new Set();
      fetchedProducts.forEach((item) => {
        if (item?.product?._id && !seenProductIds.has(item.product._id)) {
          seenProductIds.add(item.product._id);
          uniqueProducts.push(item);
        } else if (!item?.product?._id) {
          console.warn("Product missing ID:", item);
        }
      });

      const productsWithSizes = uniqueProducts.map((product) => ({
        ...product,
        sizes: product.variant?.sizes || [],
      }));

      const filteredProducts = selectedColor
        ? productsWithSizes.filter(
            (product) =>
              product.variant?.colorName?.toLowerCase() ===
              selectedColor.toLowerCase()
          )
        : productsWithSizes;

      setAllProduct(filteredProducts);
      setTotalPages(
        Math.max(1, Math.ceil(filteredProducts.length / productsPerPage))
      );
      setCurrentPage(1);
    } catch (err) {
      setError("Failed to load products. Please try again later.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [baseApi, minPrice, maxPrice, selectedSortOption, selectedColor]);

  useEffect(() => {
    dispatch(resetColor());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (totalPages < currentPage) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1);

  const paginatedProducts = allProduct.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  console.log("Paginated Products:", paginatedProducts);

  return (
    <div>
      <div className="grid grid-cols-1 gap-y-4 xl:gap-6 mt-4 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <SkeletonLoader />
        ) : error ? (
          <div>{error}</div>
        ) : paginatedProducts.length === 0 ? (
          <div>No products available.</div>
        ) : (
          paginatedProducts
            .filter(
              (item) => item?.product?.isActive && item?.category?.isActive
              // item?.subCategory?.isActive
            )
            .map((item) => (
              <NewProductItem
                key={item?.product?._id}
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
                classItem=""
                stock={item?.stock}
              />
            ))
        )}
      </div>
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        getPageNumbers={getPageNumbers}
      ></PaginationControls>
    </div>
  );
};

// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   onPageChange,
//   getPageNumbers,
// }) => {
//   const pageNumbers = getPageNumbers();

//   return (
//     <div className="flex items-center justify-center mt-28 space-x-2">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className={`w-10 h-10 border rounded-full flex items-center justify-center  ${
//           currentPage === 1
//             ? "bg-gray-300 text-gray-500"
//             : "bg-texthead text-white hover:bg-red-500"
//         } transition-colors`}
//       >
//         <FaChevronLeft />
//       </button>
//       {pageNumbers.map((number) => (
//         <button
//           key={number}
//           onClick={() => onPageChange(number)}
//           className={`w-10 h-10 border rounded-full flex items-center justify-center ${
//             number === currentPage
//               ? "bg-red-500 text-white"
//               : "bg-white text-texthead hover:bg-red-100"
//           } transition-colors`}
//         >
//           {number}
//         </button>
//       ))}
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className={`w-10 h-10 border rounded-full flex items-center justify-center ${
//           currentPage === totalPages
//             ? "bg-gray-300 text-gray-500"
//             : "bg-texthead text-white hover:bg-red-500"
//         } transition-colors`}
//       >
//         <FaChevronRight />
//       </button>
//     </div>
//   );
// };

export default Shop;
