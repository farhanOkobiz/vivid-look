import React from "react";
import Containar from "../../layouts/Containar";
import imgs1 from "../../assets/icons/FastDelivery.png";
import imgs2 from "../../assets/icons/Guarantee.png";
import imgs3 from "../../assets/icons/Return.png";
import imgs4 from "../../assets/icons/NextLevel.png";
import { motion } from "framer-motion";

const features = [
  {
    imgSrc: imgs1, // Replace with the actual path to your image
    title: "Fast & Secure Delivery",
  },
  {
    imgSrc: imgs2, // Replace with the actual path to your image
    title: "100% Guarantee On Product",
  },
  {
    imgSrc: imgs3, // Replace with the actual path to your image
    title: "24 Hour Return Policy",
  },
  {
    imgSrc: imgs4, // Replace with the actual path to your image
    title: "Next Level Pro Quality",
  },
];

const Featuresupdate = () => {
  return (
    <Containar>
      <motion.div
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 py-4 px-2 lg:px-0"
      >
        {features.map((feature, index) => (
          <motion.div
            // whileHover={{ scale: 1.05 }}
            key={index}
            className="py-3 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:shadow-md duration-200"
          >
            <img src={feature.imgSrc} alt={feature.title} className="mb w-6 h-6" />
            <h3 className="text-center text-sm lg:text-base ml-2">
              {feature.title}
            </h3>
          </motion.div>
        ))}
      </motion.div>
    </Containar>
  );
};

export default Featuresupdate;
