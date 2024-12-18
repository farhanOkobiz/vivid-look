import React, { useEffect, useState, useContext } from "react";
import { FaMinus } from "react-icons/fa6";
import Containar from "../../layouts/Containar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TiArrowBackOutline } from "react-icons/ti";
import { deleteFromCart, resetCart } from "../../redux/slices/cartSlices";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import axios from "axios";
import { MdOutlineDeleteForever } from "react-icons/md";
import { city } from "../constants";
import ApiContext from "../baseapi/BaseApi";
import freeshippingImg from "../../assets/icons/freeshipping-BO3hBmAA.png";

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCity, setLoadingCity] = useState(true);
  const [loadingZone, setLoadingZone] = useState(true);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [zonelist, setZoneList] = useState([]);
  const [arealist, setAreaList] = useState([]);
  const [cityKey, setCityKey] = useState(0);
  const [ZoneKey, setZoneKey] = useState(0);
  const baseApi = useContext(ApiContext);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    district: {},
    streetAddress: "",
    area: {},
    zone: {},
    shipping: "",
    payment: "cod",
    couponCode: "",
  });

  useEffect(() => {
    setLoadingCity(true);
    if (cityKey !== 0) {
      getCZone(cityKey);
    }
  }, [cityKey]);

  useEffect(() => {
    setLoadingZone(true);
    getCArea(ZoneKey);
  }, [ZoneKey]);

  const getCZone = async (id) => {
    try {
      const response = await axios.post(
        `${baseApi}/pathaoLocation/city/${id}/zones`
      );

      setZoneList(response.data.data.data);
      if (response?.data?.data.data.length > 0) {
        setLoadingCity(false);
      }
    } catch (error) {
      console.error("Error fetching zones:", error);
      return null;
    }
  };

  const getCArea = async (id) => {
    if (id === 0) {
      return;
    }
    try {
      const res = await axios.post(
        `${baseApi}/pathaoLocation/zone/${id}/area-list`
      );
      setAreaList(res?.data?.data.data);
      if (res?.data?.data.data.length > 0) {
        setLoadingZone(false);
      }
      // console.log(arealist, "arealist");
    } catch (error) {
      console.error(error);
    }
  };

  // console.log("formData", formData);

  const handleCouponCode = async () => {
    if (formData.couponCode.trim() === "") {
      setCouponError("Coupon code cannot be empty");
      setCouponDiscount(0);
      formData.couponCode = "";
      return;
    }

    try {
      const response = await axios.get(
        `${baseApi}/coupon/${formData.couponCode}`
      );

      if (response.data.status == "success") {
        setCouponDiscount(response.data.data.coupon.discountPercent);
        setCouponError("");
      } else {
        setCouponError("Invalid coupon code");
        setCouponDiscount(0);
      }
    } catch (error) {
      console.error("Error fetching coupon", error);
      setCouponError("Coupon code not found");
      setCouponDiscount(0);
    }
  };

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state?.cart?.items);

  const hasFreeShipping = cartItems?.some((item) =>
    item?.variants?.some((variant) =>
      variant?.options?.some((option) => option.freeShipping === true)
    )
  );

  const calculateSubtotal = () => {
    return cartItems?.reduce(
      (total, item) =>
        total +
        (couponDiscount > 0
          ? item?.selectedOption?.price
          : item?.selectedOption.discountValue > 0
          ? Math.ceil(item?.selectedOption?.salePrice)
          : item?.selectedOption?.price) *
          item.quantity,
      0
    );
  };

  const getShippingCost = () => {
    if (hasFreeShipping) return 0;
    switch (formData?.shipping) {
      case "insideDhaka":
        return 70;
      case "outsideDhaka":
        return 140;
      default:
        return 0;
    }
  };

  const calculateTotalCost = () => {
    const subtotal = calculateSubtotal();
    const discount = (couponDiscount / 100) * subtotal;
    const shippingCost = getShippingCost();
    const total = subtotal - discount + shippingCost;
    return Math.ceil(total);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "area" || name === "district" || name === "zone") {
      updatedValue = JSON.parse(value);
    }

    setFormData({
      ...formData,
      [name]: updatedValue,
    });

    if (name === "district") {
      const selectedCity = JSON.parse(value);

      if (selectedCity?.city_name === "Dhaka") {
        setFormData((prevState) => ({
          ...prevState,
          shipping: "insideDhaka",
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          shipping: "outsideDhaka",
        }));
      }
    }

    if (name === "district") {
      setCityKey(updatedValue?.city_id || 0);
    }
    if (name === "zone") {
      setZoneKey(updatedValue?.zone_id || 0);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required";
    } else if (!/^\d{11,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be at least 11 digits";
    }
    if (!formData.streetAddress)
      newErrors.streetAddress = "Street Address is required";
    if (!formData.shipping && !hasFreeShipping)
      newErrors.shipping = "Shipping method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const orderData = {
          name: formData.fullName,
          phone: formData.phoneNumber,
          email: formData.email,
          streetAddress: formData.streetAddress,
          shippingCost: getShippingCost(),
          products: cartItems.map((item) => ({
            option: item.colorOptionId,
            quantity: item.quantity,
            userSelectedColor: item.userChoiceColor || "",
          })),
          ...(formData.couponCode.trim() && { coupon: formData.couponCode }),
        };

        // console.log("orderData", orderData);

        const apiEndpoint = formData.couponCode.trim()
          ? `${baseApi}/order/withCoupon`
          : `${baseApi}/order`;

        const response = await axios.post(apiEndpoint, orderData);

        dispatch(resetCart());
        navigate("/thankyou");
      } catch (error) {
        setIsLoading(false);
        console.error("Error submitting order", error);
        setCouponError(
          error.response?.data?.message ||
            "An error occurred while placing the order"
        );
      }
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      shipping: "",
      payment: "cod",
      couponCode: "",
      district: {},
      streetAddress: "",
      area: {},
      zone: {},
    });
    setErrors({});
  };

  return (
    <section className="pb-20 font-inter bg-[#FEF6F6]">
      {cartItems?.length > 0 ? (
        <Containar>
          <div>
            <div className="grid grid-cols-12  md:gap-x-8">
              <div className="col-span-12 order-2 lg:order-1 lg:col-span-8  ">
                <div className="bg-white pt-8 pb-12 px-6 shadow-md rounded">
                  <h2 className="text-texthead text-lg font-medium uppercase">
                    Contact Info
                  </h2>
                  <div className="mt-7">
                    <form onSubmit={handleSubmit}>
                      <div className="w-full flex items-start flex-wrap justify-between">
                        <div className="w-full">
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full h-12 px-3 border mt-2 rounded ${
                              errors.fullName
                                ? "border-red-500"
                                : "border-border"
                            }`}
                            placeholder="Full Name *"
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.fullName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="w-full flex items-start flex-wrap justify-between mt-5">
                        <div className="w-full lg:w-[49%]">
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className={`w-full h-12 px-3 border mt-2 rounded ${
                              errors.phoneNumber
                                ? "border-red-500"
                                : "border-border"
                            }`}
                            placeholder=" Phone Number *"
                          />
                          {errors.phoneNumber && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.phoneNumber}
                            </p>
                          )}
                        </div>
                        <div className="w-full lg:w-[49%] mt-5 lg:mt-0">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 px-3 border border-border mt-2"
                            placeholder="Email (optional)"
                          />
                        </div>
                      </div>

                      <h2 className="text-texthead text-lg font-medium mt-10 uppercase">
                        Billing & Shipping
                      </h2>

                      {/* <div className="w-full flex items-start flex-wrap justify-between">
                        <div className="w-full lg:w-[49%] lg:mt-0 mt-5">
                          <select
                            onChange={handleChange}
                            className={`w-full py-3  px-3 mt-2 h-12 leading-tight text-texthead transition border rounded-md appearance-none lg:pl-3 focus:shadow focus:placeholder-gray-600 focus:outline-none focus:ring-gray-600 focus:shadow-outline ${
                              errors.district
                                ? "border-red-500"
                                : "border-border"
                            }
                            }`}
                            name="district"
                          >
                            {city?.map((cityInfo) => (
                              <option
                                key={cityInfo?.city_id}
                                value={JSON.stringify(cityInfo)}
                              >
                                {cityInfo?.city_name}{" "}
                              </option>
                            ))}
                          </select>
                          {errors.district && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.district}
                            </p>
                          )}
                        </div>
                        <div className="w-full lg:w-[49%] mt-5 lg:mt-0">
                          <select
                            onChange={handleChange}
                            className={`w-full py-3  px-3 mt-2 h-12 leading-tight text-texthead transition border rounded-md appearance-none lg:pl-3 focus:shadow focus:placeholder-gray-600 focus:outline-none focus:ring-gray-600 focus:shadow-outline ${
                              errors.district
                                ? "border-red-500"
                                : "border-border"
                            }
                            }`}
                            name="zone"
                          >
                            {loadingCity ? (
                              <>
                                <option value="">Zone ↓</option>
                                <option value="">Loading...</option>
                              </>
                            ) : (
                              <>
                                <option value="">Zone ↓</option>

                                {zonelist?.map((zoneInfo) => (
                                  <option
                                    key={zoneInfo?.zone_id}
                                    value={JSON.stringify(zoneInfo)}
                                  >
                                    {zoneInfo?.zone_name}{" "}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>

                          {errors.zone && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.zone}
                            </p>
                          )}
                        </div>
                      </div> */}
                      <div className="w-full flex items-start flex-wrap justify-between mt-5">
                        {/* <div className="w-full lg:w-[49%] mt-5 lg:mt-0">
                          <select
                            onChange={handleChange}
                            className={`w-full py-3  px-3 mt-2 h-12 leading-tight text-texthead transition border rounded-md appearance-none lg:pl-3 focus:shadow focus:placeholder-gray-600 focus:outline-none focus:ring-gray-600 focus:shadow-outline ${
                              errors.district
                                ? "border-red-500"
                                : "border-border"
                            }
                            }`}
                            name="area"
                          >
                            {loadingZone ? (
                              <>
                                <option value="">Area ↓</option>
                                <option value="">Loading...</option>
                              </>
                            ) : (
                              <>
                                <option value="">Area ↓</option>
                                {arealist?.map((areaInfo) => (
                                  <option
                                    key={areaInfo?.area_id}
                                    value={JSON.stringify(areaInfo)}
                                  >
                                    {areaInfo?.area_name}{" "}
                                  </option>
                                ))}
                              </>
                            )}
                          </select>
                          {errors.area && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.area}
                            </p>
                          )}
                        </div> */}
                        <div className="w-full mt-5 lg:mt-0">
                          <textarea
                            name="streetAddress"
                            value={formData.streetAddress}
                            onChange={handleChange}
                            className={`w-full h-32 p-3 border rounded-lg mt-2 ${
                              errors.streetAddress
                                ? "border-red-500"
                                : "border-border"
                            }`}
                            placeholder="Street Address *"
                          />
                          {errors.streetAddress && (
                            <p className="text-red-500 text-sm mt-0.5">
                              {errors.streetAddress}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="w-full flex items-start flex-wrap justify-between mt-10">
                        {/* {console.log("hasFreeShipping:", hasFreeShipping)}{" "} */}
                        {hasFreeShipping ? (
                          <div className="flex gap-2 items-center">
                            <img
                              src={freeshippingImg}
                              alt=""
                              className="w-32"
                            />{" "}
                            <span className="blinking-text">
                              product. Yeah!!!
                            </span>
                          </div>
                        ) : (
                          <div className="w-full lg:w-[49%]">
                            <h4 className="text-[15px] font-medium mb-5 uppercase">
                              Shipping *
                            </h4>
                            <div className="flex flex-wrap gap-x-10  items-start">
                              <label className="flex items-start text-sm font-medium gap-x-1 cursor-pointer">
                                <input
                                  className="mt-1"
                                  name="shipping"
                                  id="shippingInsideDhaka"
                                  type="radio"
                                  value="insideDhaka"
                                  checked={formData.shipping === "insideDhaka"}
                                  onChange={handleChange}
                                  required={!hasFreeShipping}
                                  disabled={hasFreeShipping}
                                />
                                <div>
                                  <h3>Inside of Dhaka</h3>
                                  <h4 className="mt-2 sm:mt-5 flex items-center gap-x-0.5">
                                    ৳ 70tk
                                  </h4>
                                </div>
                              </label>
                              <label className="flex items-start text-sm font-medium gap-x-1 cursor-pointer ">
                                <input
                                  className="mt-1"
                                  name="shipping"
                                  id="shippingOutsideDhaka"
                                  type="radio"
                                  value="outsideDhaka"
                                  checked={formData.shipping === "outsideDhaka"}
                                  onChange={handleChange}
                                  required={!hasFreeShipping}
                                  disabled={hasFreeShipping}
                                />
                                <div>
                                  <h3>Outside of Dhaka</h3>
                                  <h4 className="mt-2 sm:mt-5 flex items-center gap-x-0.5">
                                    ৳ 140tk
                                  </h4>
                                </div>
                              </label>
                            </div>
                            {errors.shipping && (
                              <p className="text-red-500 text-sm mt-2">
                                {errors.shipping}
                              </p>
                            )}
                          </div>
                        )}
                        <div className="w-full mt-7 sm:mt-0 lg:w-[49%]">
                          <h4 className="text-[15px] font-medium mb-2 sm:mb-5 uppercase">
                            Coupons Codes
                          </h4>
                          <input
                            type="text"
                            name="couponCode"
                            value={formData.couponCode}
                            onChange={handleChange}
                            className={`w-full h-12 px-3 border mt-2 ${
                              errors.couponCode
                                ? "border-red-500"
                                : "border-border"
                            }`}
                            placeholder="Enter your coupon code"
                          />
                          <button
                            type="button"
                            onClick={handleCouponCode}
                            className="mt-2 bg-red-500 hover:opacity-60 transition-all ease-linear duration-200 text-white px-4 py-2 rounded"
                          >
                            Apply Coupon
                          </button>
                          {couponError && (
                            <p className="text-red-500 text-sm mt-2">
                              {couponError}
                            </p>
                          )}

                          {couponDiscount > 0 && !couponError && (
                            <p className="text-green-600 text-sm mt-2">
                              Coupon applied! Discount: {couponDiscount}%
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-16 flex gap-4">
                        <button
                          type="button"
                          onClick={handleReset}
                          disabled={isLoading}
                          className="px-10 rounded bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200"
                        >
                          Reset
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full rounded py-3 flex items-center text-white justify-center font-medium hover:bg-green-600 transition-all ease-linear duration-200 bg-texthead cursor-pointer"
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin h-5 w-5 mr-3 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"
                                ></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            "Place Order"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-span-12 order-1 lg:order-2 mt-5 lg:mt-0 lg:col-span-4">
                <div className="pt-3 bg-white shadow-md border border-texthead rounded">
                  <div className="py-5 border-b border-b-border">
                    <h2 className="px-6  text-texthead text-lg font-medium uppercase">
                      Your Order Overview
                    </h2>
                    <ul className="mt-5">
                      {cartItems.map((item) => (
                        <li
                          key={item?._id}
                          className="px-6 flex items-center justify-between text-sm py-3"
                        >
                          <span className="w-[70%]">
                            <Link
                              to={`/productdetail/${item?._id}`}
                              className="text-texthead cursor-pointer hover:text-red-500 transition-all ease-linear duration-200"
                            >
                              {item?.name}
                            </Link>{" "}
                            <span className="text-red-500">
                              {" "}
                              × {item?.quantity}
                            </span>
                            {item?.userChoiceColor &&
                              item?.userChoiceColor.length > 0 && (
                                <h4 className="text-xs mt-1">
                                  Color:{" "}
                                  <span className="capitalize w-4 h-4">
                                    {item?.userChoiceColor}
                                  </span>
                                </h4>
                              )}
                          </span>{" "}
                          <span className="flex items-center gap-x-1 ">
                            {couponDiscount > 0 ? (
                              <span className="flex items-center text-sm font-medium text-red-500 gap-x-0.5">
                                {" "}
                                ৳ {item?.selectedOption?.price}
                              </span>
                            ) : (
                              <>
                                <span className="flex items-center text-sm font-medium text-texthead gap-x-0.5">
                                  {" "}
                                  <span className="mr-1">৳</span>
                                  {(item?.selectedOption?.discountValue > 0
                                    ? Math.ceil(item?.selectedOption?.salePrice)
                                    : item?.selectedOption?.price) *
                                    item?.quantity}
                                </span>
                                {item?.selectedOption?.discountValue > 0 && (
                                  <del className="line-through text-normal text-red-500">
                                    {" "}
                                    {item?.selectedOption?.discountValue > 0 &&
                                      item?.selectedOption?.price *
                                        item?.quantity}
                                  </del>
                                )}
                              </>
                            )}

                            <span
                              onClick={() =>
                                dispatch(
                                  deleteFromCart({
                                    id: item._id,
                                    colorOptionId: item?.selectedOption?._id,
                                    selectedSize: item?.selectedSize,
                                  })
                                )
                              }
                              className="text-red-500 cursor-pointer text-lg"
                            >
                              <MdOutlineDeleteForever />
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="py-10 border-b border-b-border">
                      <ul className=" px-6 flex items-center justify-between text-base">
                        <li>Coupon Discount</li>
                        <li className="flex items-center gap-x-0.5">
                          <FaMinus className="mr-1" /> {couponDiscount} %
                        </li>
                      </ul>
                    </div>
                  )}

                  <div className="py-10 border-b border-b-border">
                    <ul className=" px-6 flex items-center justify-between text-base">
                      <li className="uppercase">Subtotal</li>
                      <li className="flex items-center gap-x-0.5">
                        <span className="mr-1">৳</span>
                        {couponDiscount > 0
                          ? Math.ceil(
                              calculateSubtotal() -
                                calculateSubtotal() * (couponDiscount / 100)
                            )
                          : calculateSubtotal()}
                      </li>
                    </ul>
                  </div>

                  <div className="py-10 border-b border-b-border">
                    <h2 className="px-6 uppercase text-texthead text-lg font-medium">
                      Delivery Charge
                    </h2>
                    <div className="mt-7 px-6 text-sm flex justify-between items-center">
                      <div className="flex items-start text-base font-normal gap-x-1">
                        <input
                          className="mt-1"
                          name="payment"
                          id="paymentCOD"
                          type="radio"
                          value="cod"
                          checked={formData.payment === "cod"}
                          onChange={handleChange}
                          required
                        />
                        <div>
                          <h3>Cash on delivery</h3>
                        </div>
                      </div>
                      <div className="flex items-start text-base font-normal gap-x-1">
                        <h3 className="flex items-center gap-x-1 text-sm">
                          <span className="mr-1">৳</span> {getShippingCost()}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="py-10 border-b border-b-border flex justify-between">
                    <h2 className="px-6 uppercase text-texthead text-lg font-medium">
                      Total Cost
                    </h2>
                    <h2 className="px-6 capitalize text-red-500 text-lg font-bold flex items-center gap-x-1">
                      <span className="mr-1">৳</span> {calculateTotalCost()}
                    </h2>
                  </div>

                  <div className="py-10 border-b border-b-border">
                    <p className="px-6 text-sm font-normal">
                      Your personal data will be used to process your order,
                      support your experience throughout this website, and for
                      other purposes described in our{" "}
                      <Link to={"/privacy"} className="text-red-500 underline">
                        privacy policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    onClick={() => navigate("/cart")}
                    className="py-5 w-full flex rounded items-center justify-center border-black border text-black hover:text-white duration-200 font-medium hover:bg-black"
                  >
                    <span className="flex items-center gap-x-1">
                      <TiArrowBackOutline /> View Cart
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Containar>
      ) : (
        <div className="">
          <div className="flex justify-center items-center">
            <HiOutlineShoppingBag className="text-[240px]" />
          </div>
          <h2 className="text-center text-2xl font-medium mt-5">
            Your Cart is currently empty.
          </h2>
          <div className="flex justify-center items-center mt-6 pb-10">
            <Link
              className="text-lg bg-texthead hover:bg-black transition-all ease-linear duration-200 font-medium px-16 py-4 text-white"
              to={"/shop"}
            >
              Return to shop
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default CheckoutForm;
