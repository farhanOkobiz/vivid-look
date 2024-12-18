import React from "react";
import { Link } from "react-router-dom";
import Containar from "../../layouts/Containar";
import { socialList } from "../constants";
import ProductSections from "./ProductSections";

const AboutInfo = () => {
  return (
    <section>
      <Containar>
        <div className="space-y-10">
          {/* Welcome Section */}
          <div className="px-5 py-10 lg:px-20 lg:py-20 bg-gradient-to-b from-purple-200 to-gray-200 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold">
              Welcome to Vivid Look
            </h2>
            <p className="mt-4 text-sm lg:text-base leading-relaxed max-w-3xl mx-auto">
              Discover a stunning collection of stylish and durable bags
              designed to complement your unique lifestyle. At Vivid Look, we
              believe in providing quality and fashionable bags for every
              occasion.
            </p>
            <ul className="mt-8 space-y-4 text-left max-w-3xl mx-auto">
              <li>
                <strong>Handbags:</strong> Elegant and practical designs for
                daily use.
              </li>
              <li>
                <strong>Backpacks:</strong> Durable and spacious for your
                travel and work needs.
              </li>
              <li>
                <strong>Sling Bags:</strong> Compact and stylish options for
                a casual look.
              </li>
              <li>
                <strong>Tote Bags:</strong> Versatile and roomy, perfect for
                shopping or a day out.
              </li>
              <li>
                <strong>Travel Bags:</strong> Designed to make your journeys
                comfortable and organized.
              </li>
            </ul>
          </div>

          {/* Quality Promise Section */}
          <div className="px-5 py-10 lg:px-20 lg:py-20 bg-gradient-to-b from-blue-200 to-gray-200 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold">
              Unmatched Quality and Durability
            </h2>
            <p className="mt-4 text-sm lg:text-base leading-relaxed max-w-3xl mx-auto">
              Our bags are crafted with premium materials to ensure style,
              durability, and comfort. Explore our collections designed to cater
              to all your needs, whether it's work, travel, or leisure.
            </p>
            <ul className="mt-8 space-y-4 text-left max-w-3xl mx-auto">
              <li>
                <strong>Eco-Friendly Materials:</strong> Sustainable and
                responsible choices for the environment.
              </li>
              <li>
                <strong>Water-Resistant Designs:</strong> Protect your
                belongings with our innovative bag materials.
              </li>
              <li>
                <strong>Ergonomic Straps:</strong> Comfortable designs for
                long-term use.
              </li>
              <li>
                <strong>Multiple Compartments:</strong> Stay organized with
                well-thought-out spaces.
              </li>
              <li>
                <strong>Trendy Styles:</strong> Stay ahead in fashion with our
                contemporary bag designs.
              </li>
            </ul>
          </div>

          {/* Accessories Section */}
          <div className="px-5 py-10 lg:px-20 lg:py-20 bg-gradient-to-b from-pink-200 to-gray-200 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold">
              Stylish Accessories for Every Bag
            </h2>
            <p className="mt-4 text-sm lg:text-base leading-relaxed max-w-3xl mx-auto">
              Complete your bag with our range of stylish and functional
              accessories, designed to enhance your experience.
            </p>
            <ul className="mt-8 space-y-4 text-left max-w-3xl mx-auto">
              <li>
                <strong>Bag Charms:</strong> Add a touch of personality to
                your bag.
              </li>
              <li>
                <strong>Organizers:</strong> Keep your belongings neat and
                accessible.
              </li>
              <li>
                <strong>Protective Covers:</strong> Ensure your bags stay in
                pristine condition.
              </li>
            </ul>
          </div>

          {/* Travel Collection Section */}
          <div className="px-5 py-10 lg:px-20 lg:py-20 bg-gradient-to-b from-yellow-200 to-blue-200 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold">
              Explore Our Travel Collection
            </h2>
            <p className="mt-4 text-sm lg:text-base leading-relaxed max-w-3xl mx-auto">
              Make your journeys memorable with our thoughtfully designed travel
              bags that combine style, space, and convenience.
            </p>
            <ul className="mt-8 space-y-4 text-left max-w-3xl mx-auto">
              <li>
                <strong>Carry-On Bags:</strong> Compact yet spacious for
                short trips.
              </li>
              <li>
                <strong>Duffel Bags:</strong> Flexible and roomy for
                adventurous travels.
              </li>
              <li>
                <strong>Luggage Sets:</strong> Perfectly coordinated sets for
                your travel needs.
              </li>
            </ul>
          </div>

          <ProductSections />

          {/* Follow Us Section */}
          <div className="px-5 py-10 lg:px-20 lg:py-20 bg-gradient-to-b from-blue-200 to-indigo-100 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold">
              Follow Us on Social Media
            </h2>
            <p className="mt-4 text-sm lg:text-base">
              Stay connected and follow our latest updates on social media!
            </p>
            <div className="flex justify-center gap-5 mt-10">
              {socialList.map((item, index) => {
                const Icon = item.logo;
                return (
                  <Link
                    key={index}
                    to={item.link}
                    className="transition-transform transform hover:scale-110"
                    target="_blank"
                  >
                    <Icon className="w-10 h-10 bg-gray-600 p-2 text-white rounded-md" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Containar>
    </section>
  );
};

export default AboutInfo;
