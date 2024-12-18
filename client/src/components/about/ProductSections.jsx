import React from "react";
import Containar from "../../layouts/Containar";

const ProductSections = () => {
  const sections = [
    {
      id: "backpacks",
      title: "Trendy Backpacks for Every Occasion",
      description:
        "Explore our exclusive range of backpacks designed for style, durability, and everyday functionality.",
      bgGradient: "from-blue-200 to-gray-200",
      categories: [
        { name: "Laptop Backpacks", detail: "Perfect for work and travel." },
        { name: "Casual Backpacks", detail: "Stylish and versatile for daily use." },
        { name: "Travel Backpacks", detail: "Spacious and comfortable for long trips." },
        { name: "School Backpacks", detail: "Durable and practical for students." },
      ],
    },
    {
      id: "handbags",
      title: "Elegant Handbags for Every Style",
      description:
        "Discover our collection of handbags that combine modern design with premium craftsmanship.",
      bgGradient: "from-gray-100 to-blue-300",
      categories: [
        { name: "Tote Bags", detail: "Spacious and perfect for everyday use." },
        { name: "Crossbody Bags", detail: "Convenient and stylish for on-the-go." },
        { name: "Clutches", detail: "Sophisticated and perfect for evenings." },
        { name: "Shoulder Bags", detail: "Classic designs for timeless elegance." },
      ],
    },
    {
      id: "accessories",
      title: "Stylish Accessories to Complement Your Look",
      description:
        "Elevate your style with our range of thoughtfully curated bag accessories.",
      bgGradient: "from-yellow-100 to-orange-300",
      categories: [
        { name: "Bag Charms", detail: "Add a unique touch to your bags." },
        { name: "Key Holders", detail: "Stylish and practical key organizers." },
        { name: "Wallets", detail: "Compact and elegant designs." },
        { name: "Straps", detail: "Customizable straps for a personal touch." },
      ],
    },
    {
      id: "travel-bags",
      title: "Premium Travel Bags for Every Journey",
      description:
        "Make your travels comfortable and stylish with our premium travel bag collection.",
      bgGradient: "from-green-100 to-green-300",
      categories: [
        { name: "Duffel Bags", detail: "Spacious and durable for all trips." },
        { name: "Rolling Suitcases", detail: "Effortless mobility for long journeys." },
        { name: "Weekender Bags", detail: "Compact and perfect for short getaways." },
        { name: "Travel Organizers", detail: "Keep your essentials neatly arranged." },
      ],
    },
    {
      id: "unique-products",
      title: "Exclusive Designer Collections",
      description:
        "Explore our unique and limited-edition bags crafted for those who value exclusivity.",
      bgGradient: "from-gray-100 to-gray-300",
      categories: [
        { name: "Designer Handbags", detail: "Crafted with attention to detail." },
        { name: "Limited-Edition Backpacks", detail: "Exclusive designs for trendsetters." },
        { name: "Customizable Bags", detail: "Tailor-made for your preferences." },
        { name: "Luxury Travel Bags", detail: "Sophistication meets functionality." },
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
