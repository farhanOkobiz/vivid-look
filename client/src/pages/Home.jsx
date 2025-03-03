// import React, { useEffect, useState } from "react";
// import Banner from "../components/home/Banner";
// import Feature from "../components/home/Feature";
// import BestSell from "../components/home/BestSell";
// import SaleFeature from "../components/home/SaleFeature";
// import BestDealWeek from "../components/home/BestDealWeek";
// import NewRelease from "../components/home/NewRelease";
// import Brand from "../components/home/Brand";
// import Review from "../components/home/Review";
// import Containar from "../layouts/Containar";
// import Featuresupdate from "../components/home/Featuresupdate";

// const Home = () => {
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const [bannerLoader, setBannerLoader] = useState(false);
//   const [saleFeatureLoader, setSaleFeatureLoader] = useState(false);
//   const [newReleaseLoader, setNewReleaseLoader] = useState(false);
//   const [featureLoader, setFeatureLoader] = useState(false);

//   // Check if all components have loaded
//   const loading = !(
//     bannerLoader &&
//     saleFeatureLoader &&
//     newReleaseLoader &&
//     featureLoader
//   );

//   return (
//     <>
//       {loading ? (
//         // Show loading spinner while fetching data
//         <div className="fixed top-0 right-0 w-full z-50 flex justify-center items-center h-screen bg-white">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
//         </div>
//       ) : (
//         <div></div>
//       )}
//       <>
//         <Banner onLoadComplete={() => setBannerLoader(true)} />
//         {/* <Featuresupdate/> */}
//         {/* <BestSell /> */}
//         <SaleFeature onLoadComplete={() => setSaleFeatureLoader(true)} />
//         {/* <BestDealWeek /> */}
//         <NewRelease onLoadComplete={() => setNewReleaseLoader(true)} />
//         <Feature onLoadComplete={() => setFeatureLoader(true)} />
//         {/* <Brand /> */}
//         {/* <Review /> */}
//       </>
//     </>
//   );
// };

// export default Home;

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
    // saleFeature: false,
    // newRelease: false,
    // feature: false,
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

      <Banner onLoadComplete={() => handleLoadComplete("banner")} />
      <SaleFeature 
      // onLoadComplete={() => handleLoadComplete("saleFeature")} 
      />
      <NewRelease 
      // onLoadComplete={() => handleLoadComplete("newRelease")}
       />
      <Feature 
      // onLoadComplete={() => handleLoadComplete("feature")} 
      />
    </>
  );
};

export default Home;
