import React from "react";
import Containar from "../../layouts/Containar";

const ProductSections = () => {
  const sections = [
    {
      id: "basins",
      title: "Elegant Basins for Every Style",
      description:
        "Explore our premium collection of basins that blend modern design with everyday functionality.",
      bgGradient: "from-blue-200 to-gray-200",
      categories: [
        { name: "Wall-Mounted Basins", detail: "Space-saving and stylish." },
        { name: "Pedestal Basins", detail: "Classic designs for timeless elegance." },
        { name: "Countertop Basins", detail: "Modern basins for a sleek look." },
        { name: "Corner Basins", detail: "Perfect for compact spaces." },
      ],
    },
    {
      id: "commodes",
      title: "Durable Commodes for Ultimate Comfort",
      description:
        "Our range of commodes is designed to provide lasting comfort and functionality in your bathroom.",
      bgGradient: "from-gray-100 to-blue-300",
      categories: [
        { name: "Wall-Hung Commodes", detail: "Minimalist and modern." },
        { name: "Floor-Mounted Commodes", detail: "Reliable and classic designs." },
        { name: "Smart Toilets", detail: "Advanced features for added convenience." },
        { name: "Eco-Friendly Options", detail: "Water-efficient and sustainable." },
      ],
    },
    {
      id: "accessories",
      title: "Bathroom Accessories That Inspire",
      description:
        "Add a touch of elegance and convenience to your bathroom with our thoughtfully curated accessories.",
      bgGradient: "from-yellow-100 to-orange-300",
      categories: [
        { name: "Towel Racks", detail: "Stylish and space-saving options." },
        { name: "Soap Dispensers", detail: "Hygienic and modern designs." },
        { name: "Shower Heads", detail: "Luxury shower experiences." },
        { name: "Mirrors", detail: "High-quality and elegantly framed." },
      ],
    },
    {
      id: "kitchen",
      title: "Complete Kitchen Solutions",
      description:
        "Enhance your kitchen with sinks and faucets designed for efficiency and aesthetic appeal.",
      bgGradient: "from-green-100 to-green-300",
      categories: [
        { name: "Stainless Steel Sinks", detail: "Durable and corrosion-resistant." },
        { name: "Water Purifiers", detail: "Clean and safe water for daily use." },
        { name: "Kitchen Faucets", detail: "Sleek and functional designs." },
        { name: "Storage Solutions", detail: "Keep your kitchen organized." },
      ],
    },
    {
      id: "unique-products",
      title: "Innovative Sanitary Solutions",
      description:
        "Discover cutting-edge products that redefine convenience and style in sanitary essentials.",
      bgGradient: "from-gray-100 to-gray-300",
      categories: [
        { name: "Smart Shower Panels", detail: "Control your shower experience." },
        { name: "Water-Saving Devices", detail: "Eco-friendly and efficient." },
        { name: "Customizable Fixtures", detail: "Tailored to your needs." },
        { name: "Designer Collections", detail: "Exclusive designs for your home." },
      ],
    },
  ];

  return (
    <section className="">
      <Containar>
        {sections.map((section) => (
          <div
            key={section.id}
            className={`mb-10 p-6 lg:p-10 rounded-lg bg-gradient-to-b ${section.bgGradient}`}
          >
            <h2 className="text-2xl lg:text-4xl font-bold text-center mb-4">
              {section.title}
            </h2>
            <p className="text-sm lg:text-lg text-center mb-6">
              {section.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.categories.map((category, index) => (
                <div
                  key={index}
                  className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.detail}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Containar>
    </section>
  );
};

export default ProductSections;
