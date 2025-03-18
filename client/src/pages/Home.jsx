import React, { useEffect, useState } from "react";
import Banner from "../components/home/Banner";
import Feature from "../components/home/Feature";
import SaleFeature from "../components/home/SaleFeature";
import NewRelease from "../components/home/NewRelease";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Track loading state for each section
  const [loadingStates, setLoadingStates] = useState({
    banner: false,
  });

  const allLoaded = Object.values(loadingStates).every(Boolean); // Checks if all are `true`

  // Function to update the loading state
  const handleLoadComplete = (section) => {
    setLoadingStates((prev) => ({ ...prev, [section]: true }));
  };

  
  return (
    <>
      {!allLoaded && (
        <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-white z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* this is just simple some description about vividlook bcz our website open with contact page we think if ur write some description may be its work */}

      <div className="top-0 absolute hidden">
        <p>
          Shop at Vivid Look for a wide range of quality products at affordable
          prices. From everyday essentials to exclusive items, we bring
          convenience and value right to your doorstep!
        </p>

        <p>
          Bangladeshi fashion, Online shopping Bangladesh, Affordable quality
          products, Traditional Bangladeshi clothing, Ethnic wear, Modest
          fashion, Handcrafted goods Bangladesh, Everyday essentials online,
          Exclusive deals Bangladesh, Local fashion brands, Home delivery
          Bangladesh, Contemporary styles, Cultural attire, Trendy Bangladeshi
          wear, Quality garments, Sustainable fashion, Vivid Look
        </p>
      </div>

      <Banner onLoadComplete={() => handleLoadComplete("banner")} />
      <SaleFeature />
      <NewRelease />
      <Feature />
    </>
  );
};

export default Home;
