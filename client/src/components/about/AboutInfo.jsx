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
          {/* Sanitary Essentials Section */}
          <div className="px-5 py-10 lg:px-20 lg:py-20 bg-gradient-to-b from-green-200 to-gray-200 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold">
              Welcome to Vivid Look
            </h2>
            <p className="mt-4 text-sm lg:text-base leading-relaxed max-w-3xl mx-auto">
              Discover a wide range of premium sanitary solutions designed to
              enhance your home. From elegant basins to durable commodes, we
              bring you quality products crafted for style and functionality.
            </p>
            <ul className="mt-8 space-y-4 text-left max-w-3xl mx-auto">
              <li>
                <strong>Modern Basins:</strong> Stylish and functional basins to
                elevate your bathroom's elegance.
              </li>
              <li>
                <strong>Durable Commodes:</strong> Built to last with innovative
                designs for your comfort.
              </li>
              <li>
                <strong>Shower Sets:</strong> Experience luxury with our
                high-quality shower solutions.
              </li>
              <li>
                <strong>Kitchen Sinks:</strong> Sleek and practical sinks for
                every kitchen style.
              </li>
              <li>
                <strong>Bathroom Accessories:</strong> Enhance convenience with
                our thoughtfully designed accessories.
              </li>
            </ul>
          </div>

          {/* Premium Quality Section */}
          <div className="px-5 py-10 lg:px-20 lg:py-20 bg-gradient-to-b from-blue-200 to-gray-200 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold">
              Premium Sanitary Solutions for Every Home
            </h2>
            <p className="mt-4 text-sm lg:text-base leading-relaxed max-w-3xl mx-auto">
              Whether you are renovating your space or starting fresh, our
              products are here to transform your bathrooms and kitchens with
              reliability and style.
            </p>
            <ul className="mt-8 space-y-4 text-left max-w-3xl mx-auto">
              <li>
                <strong>Wall-Hung Toilets:</strong> Minimalistic and
                space-saving designs for modern homes.
              </li>
              <li>
                <strong>Floor-Mounted Commodes:</strong> Classic and sturdy,
                blending tradition with modernity.
              </li>
              <li>
                <strong>Luxury Taps:</strong> Add a touch of elegance to your
                basins and sinks.
              </li>
              <li>
                <strong>Bath Cabinets:</strong> Organize your essentials with
                our stylish and spacious options.
              </li>
              <li>
                <strong>Plumbing Fixtures:</strong> Reliable and durable
                fixtures to complete your installation.
              </li>
            </ul>
          </div>

          {/* Accessories Section */}
          <div className="px-5 py-10 lg:px-20 lg:py-20 bg-gradient-to-b from-pink-200 to-gray-200 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold">
              Stylish Bathroom Accessories
            </h2>
            <p className="mt-4 text-sm lg:text-base leading-relaxed max-w-3xl mx-auto">
              Complement your sanitary installations with our curated selection
              of stylish and functional bathroom accessories.
            </p>
            <ul className="mt-8 space-y-4 text-left max-w-3xl mx-auto">
              <li>
                <strong>Soap Dispensers:</strong> Sleek and hygienic, available
                in modern designs.
              </li>
              <li>
                <strong>Towel Racks:</strong> Space-saving and stylish options
                for every bathroom.
              </li>
              <li>
                <strong>Mirrors:</strong> High-quality mirrors with elegant
                frames for your vanity.
              </li>
            </ul>
          </div>

          {/* Kitchen Essentials Section */}
          <div className="px-5 py-10 lg:px-20 lg:py-20 bg-gradient-to-b from-yellow-200 to-blue-200 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold">
              Complete Kitchen Essentials
            </h2>
            <p className="mt-4 text-sm lg:text-base leading-relaxed max-w-3xl mx-auto">
              Elevate your kitchen with our premium range of sinks, faucets, and
              other essential installations designed for efficiency and style.
            </p>
            <ul className="mt-8 space-y-4 text-left max-w-3xl mx-auto">
              <li>
                <strong>Stainless Steel Sinks:</strong> Durable and resistant to
                corrosion for long-term use.
              </li>
              <li>
                <strong>Water Purifiers:</strong> Ensure clean and safe water
                for your family.
              </li>
              <li>
                <strong>Kitchen Faucets:</strong> Stylish and efficient designs
                for everyday use.
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
                    target= "_blank"
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
