import React, { useEffect } from "react";
import BradCumbs from "../components/bradcumbs/BradCumbs";
import CheckoutForm from "../components/checkout/CheckoutForm";

const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      {/* <BradCumbs className={"bg-[#FEF6F6]"} title={"Checkout Info"} /> */}
      <h3 className="text-[20px] md:text-[28px] lg:py-10 md:py-8 text-center font-medium  bg-[#FEF6F6] flex items-center justify-center">
        <span className="mt-4">Checkout Info</span>
      </h3>
      <CheckoutForm />
    </>
  );
};

export default Checkout;
