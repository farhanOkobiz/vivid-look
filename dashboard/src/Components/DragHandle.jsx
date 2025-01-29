import { Button } from "antd";
import React, { useContext } from "react";
import { HolderOutlined } from "@ant-design/icons";

export const RowContext = React.createContext({});
const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{
        cursor: "move",
      }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};
export default DragHandle;
