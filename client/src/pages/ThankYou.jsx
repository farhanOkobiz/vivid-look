import React, { useEffect } from "react";
import Containar from "../layouts/Containar";
import { Link, useLocation } from "react-router-dom";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { LuChevronRight } from "react-icons/lu";
const ThankYou = () => {
  const location = useLocation();
  const { data } = location.state || {};

  const { cartItems, calculateTotalCost, orderId } = data || {};
  console.log("Cart Items:", cartItems);
  console.log("Total Cost:", calculateTotalCost);
  console.log("Order ID:", orderId);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Push to GTM Data Layer
    if (cartItems && calculateTotalCost && orderId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "Purchase",
        transactionId: orderId,
        totalCost: calculateTotalCost,
        currency: "BDT",
        cartItems: cartItems?.map((item) => ({
          id: item?._id,
          name: item?.name,
          price: item?.selectedOption?.price,
          quantity: item?.quantity,
          size: item?.selectedOption?.size || "N/A",
          color: item?.selectedColor?.colorName || "N/A",
        })),
      });
      console.log("Data Layer Pushed: Purchase Event");
    } else {
      console.error("Missing required data for tracking.");
    }

    // Reload Logic
    if (!sessionStorage.getItem("hasReloaded")) {
      const timer = setTimeout(() => {
        window.location.reload();
        sessionStorage.setItem("hasReloaded", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cartItems, calculateTotalCost, orderId]);

  return (
        <div className="font-inter">
      <div>
        <div className="border-b border-b-border pt-10 mr-3">
          <Containar>
            <h3 className="flex gap-x-2 py-5 items-center text-sm">
              <Link className="inline-block" to={"/"}>
                Home
              </Link>{" "}
              <span>
                <LuChevronRight className="text-sm" />
              </span>{" "}
              <Link className="inline-block" to={"/"}>
                Thank You
              </Link>
            </h3>
          </Containar>
        </div>
        <div>
          <Containar>
            <div className="py-20">
              <h2 className="text-[100px] flex items-center justify-center  font-medium text-center text-green-600">
                <FaRegCircleCheck />
              </h2>
              <h2 className="text-2xl mt-10 text-texthead font-medium text-center">
                Thank you
              </h2>
              <h2 className="text-3xl mt-7 text-green-600 font-medium text-center">
                Your order has been completed
              </h2>
              <h4 className="text-base mt-5 text-center">
                For inquiries regarding the order, please contact us
              </h4>
              <h4 className="text-lg mt-5 text-center flex justify-center text-green-600">
                <Link
                  to={"tel:01871702222"}
                  className="flex items-center gap-x-2"
                >
                  <FaPhoneAlt /> 01871-702222
                </Link>
              </h4>
              <h4 className="text-base mt-5 text-center flex justify-center text-texthead">
                <Link
                  to={"mailto:vividlookbd@gmail.com"}
                  className="flex items-center gap-x-2"
                >
                  <MdOutlineMail /> vividlookbd@gmail.com
                </Link>
              </h4>
              <p className="text-center mt-5">You can check more products</p>
              <div className="mt-5 flex justify-center">
                <Link
                  to={"/shop"}
                  className=" text-center  inline-block cursor-pointer py-4 px-16 bg-texthead text-white"
                >
                  Go Back to Shop
                </Link>
              </div>
            </div>
          </Containar>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;

// import { useEffect } from "react";
// import Containar from "../layouts/Containar";
// import { Link } from "react-router-dom";
// import { LuChevronRight } from "react-icons/lu";
// import { FaRegCircleCheck } from "react-icons/fa6";
// import { MdOutlineMail } from "react-icons/md";
// import { FaPhoneAlt } from "react-icons/fa";

// const ThankYou = () => {
//   useEffect(() => {
//     window.scrollTo(0, 0);

//     if (!sessionStorage.getItem("hasReloaded")) {
//       const timer = setTimeout(() => {
//         window.location.reload();

//         sessionStorage.setItem("hasReloaded", "true");
//       }, 1000);

//       return () => clearTimeout(timer);
//     }
//   }, []);

//   return (
//     <div className="font-inter">
//       <div>
//         <div className="border-b border-b-border pt-10 mr-3">
//           <Containar>
//             <h3 className="flex gap-x-2 py-5 items-center text-sm">
//               <Link className="inline-block" to={"/"}>
//                 Home
//               </Link>{" "}
//               <span>
//                 <LuChevronRight className="text-sm" />
//               </span>{" "}
//               <Link className="inline-block" to={"/"}>
//                 Thank You
//               </Link>
//             </h3>
//           </Containar>
//         </div>
//         <div>
//           <Containar>
//             <div className="py-20">
//               <h2 className="text-[100px] flex items-center justify-center  font-medium text-center text-green-600">
//                 <FaRegCircleCheck />
//               </h2>
//               <h2 className="text-2xl mt-10 text-texthead font-medium text-center">
//                 Thank you
//               </h2>
//               <h2 className="text-3xl mt-7 text-green-600 font-medium text-center">
//                 Your order has been completed
//               </h2>
//               <h4 className="text-base mt-5 text-center">
//                 For inquiries regarding the order, please contact us
//               </h4>
//               <h4 className="text-lg mt-5 text-center flex justify-center text-green-600">
//                 <Link
//                   to={"tel:01871702222"}
//                   className="flex items-center gap-x-2"
//                 >
//                   <FaPhoneAlt /> 01871-702222
//                 </Link>
//               </h4>
//               <h4 className="text-base mt-5 text-center flex justify-center text-texthead">
//                 <Link
//                   to={"mailto:vividlookbd@gmail.com"}
//                   className="flex items-center gap-x-2"
//                 >
//                   <MdOutlineMail /> vividlookbd@gmail.com
//                 </Link>
//               </h4>
//               <p className="text-center mt-5">You can check more products</p>
//               <div className="mt-5 flex justify-center">
//                 <Link
//                   to={"/shop"}
//                   className=" text-center  inline-block cursor-pointer py-4 px-16 bg-texthead text-white"
//                 >
//                   Go Back to Shop
//                 </Link>
//               </div>
//             </div>
//           </Containar>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThankYou;
