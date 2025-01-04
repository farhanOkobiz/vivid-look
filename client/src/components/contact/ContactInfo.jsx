import React from "react";
import Containar from "../../layouts/Containar";
import { Link } from "react-router-dom";
import { socialList } from "../constants";

const ContactInfo = () => {
  return (
    <section className="flex items-center justify-center h-screen bg-gray-100">
      <Containar>
        <div className="flex justify-center">
          <div className="w-full max-w-4xl px-8 sm:px-12 py-10 sm:py-20 bg-white shadow-lg rounded-lg">
            {/* Heading */}
            <div className="text-center">
              <h3 className="text-3xl md:text-5xl font-bold text-gray-800">
                Contact Information
              </h3>
              <p className="mt-6 text-lg italic text-gray-600">
                Have questions? Reach out to us for assistance with online sales, rights, or partnership services.
              </p>
            </div>

            {/* Address & Contact */}
            <div className="mt-12 flex flex-col sm:flex-row sm:justify-between gap-y-8">
              <div>
                <p className="text-lg font-semibold text-gray-800">Address:</p>
                <p className="mt-2 text-gray-600">
                  BAKALIA, CHATTOGRAM, BANGLADESH
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">Email:</p>
                <Link
                  to="mailto:vividlookbd@gmail.com"
                  className="mt-2 text-blue-600 hover:underline"
                >
                  vividlookbd@gmail.com
                </Link>
                <p className="text-lg font-semibold text-gray-800 mt-4">Phone:</p>
                <Link
                  to="tel:01871702222"
                  className="text-blue-600 hover:underline"
                >
                  01871-702222
                </Link>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-16">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Follow Us on Social Media
              </h3>
              <ul className="flex justify-center gap-6">
                {socialList.map((item, index) => {
                  const Icon = item.logo;
                  return (
                    <li key={index}>
                      <Link
                        to={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-gray-500 hover:text-blue-500 transition"
                      >
                        <Icon size={32} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Containar>
    </section>
  );
};

export default ContactInfo;
