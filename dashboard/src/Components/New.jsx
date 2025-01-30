import React from "react";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Table } from "antd";
import Row from "./Row";
import DragHandle from "./DragHandle";
import { saveOrderToDB } from "../utils/saveOrderToDb";

const columns = [
  {
    key: "sort",
    align: "center",
    width: 80,
    render: () => <DragHandle />,
  },
  {
    title: "Key",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

const initialData = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "Long text Long",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
];
const DragSorting = () => {
  const [dataSource, setDataSource] = React.useState(initialData);
  //   const onDragEnd = ({ active, over }) => {
  //     if (active.id !== over?.id) {
  //       setDataSource((prevState) => {
  //         const activeIndex = prevState.findIndex(
  //           (record) => record.key === active?.id
  //         );
  //         const overIndex = prevState.findIndex(
  //           (record) => record.key === over?.id
  //         );
  //         return arrayMove(prevState, activeIndex, overIndex);
  //       });
  //     }
  //   };

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource((prevState) => {
        const activeIndex = prevState.findIndex(
          (record) => record.key === active?.id
        );
        const overIndex = prevState.findIndex(
          (record) => record.key === over?.id
        );
        const newData = arrayMove(prevState, activeIndex, overIndex);

        // Send updated order to backend
        saveOrderToDB(newData);

        return newData;
      });
    }
  };

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        items={dataSource.map((i) => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          rowKey="key"
          components={{
            body: {
              row: Row,
            },
          }}
          columns={columns}
          dataSource={dataSource}
        />
      </SortableContext>
    </DndContext>
  );
};
export default DragSorting;
