import React from "react";
import Containar from "../../layouts/Containar";

const ParagraphtoList = ({ paragraph }) => {
  return (
    <section className="">
      <Containar>
        
        <div
          className="default_behave"
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />
      </Containar>
    </section>
  );
};

export default ParagraphtoList;
