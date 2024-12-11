import React from "react";

const MapConatacts = () => {
  return (
    <div className="">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3648.8940731822164!2d90.3665231!3d23.804678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ4JzE2LjgiTiA5MMKwMjInMDguOCJF!5e0!3m2!1sen!2s!4v1700000000000"
        className="w-full h-[180px] sm:h-[300px] lg:h-[500px]"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapConatacts;
