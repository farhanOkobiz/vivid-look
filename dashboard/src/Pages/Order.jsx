import React, { useState, useEffect } from "react";
import {
  Space,
  Table,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import axios from "../Components/Axios";

const Order = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [form] = Form.useForm();

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/order");
      const orders = response.data.data.doc;
      // console.log("Fetched Orders:", orders);
      setData(orders);
      setFilteredData(orders); // Default to all orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim();

    const filtered = data?.filter((order) => {
      const orderIdMatch = order?._id
        .slice(-6)
        ?.toLowerCase()
        .includes(trimmedSearchTerm?.toLowerCase());
      const phoneMatch = order.phone
        ?.toLowerCase()
        .includes(trimmedSearchTerm.toLowerCase());
      return orderIdMatch || phoneMatch;
    });

    setFilteredData(filtered);
  };

  const handleEdit = (record) => {
    setCurrentOrder(record);
    form.setFieldsValue({
      ...record,
      colorName: record.products?.[0]?.option?.variant?.colorName || "",
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/order/${id}`);
      message.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      message.error("Failed to delete order");
      console.error("Error deleting order:", error);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const updatedProducts = currentOrder.products.map((product) => {
        return {
          ...product,
          option: {
            ...product.option,
            variant: {
              ...product.option.variant,
              colorName: values.colorName,
            },
          },
        };
      });

      await axios.patch(`/order/${currentOrder?._id}`, {
        ...values,
        products: updatedProducts,
      });

      message.success("Order updated successfully");
      setIsModalVisible(false);
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order");
      console.error("Error updating order:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`/order/${orderId}`, { orderStatus: newStatus });
      message.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      message.error("Failed to update order status");
      console.error("Error updating order status:", error);
    }
  };

  const handleCourierChange = async (order, courier) => {
    if (courier === "Steadfast") {
      try {
        const { name, phone, streetAddress, city, zone, area, totalCost } =
          order;
        const invoice = `${order._id.slice(-6)}`;

        const payload = {
          invoice,
          recipient_name: name,
          recipient_phone: phone,
          recipient_address: `${streetAddress}, ${area.areaName}, ${city.cityName}, ${zone.zoneName} `,
          cod_amount: totalCost,
        };

        const response = await axios.post(
          "https://portal.packzy.com/api/v1/create_order",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "Api-Key": "xmhh6jiis3bym1le6lzkqksahk6nnwha",
              "Secret-Key": "kmvx9x9w7nuj0pvfual65s43",
            },
          }
        );

        if (response?.data?.status === 200) {
          return message.success("Order placed with Steadfast successfully");
        }
        if (response?.data?.status === 400) {
          return message.error(response?.data?.errors.invoice);
        }
      } catch (error) {
        message.error("Error placing order with Steadfast");
        console.error("Error placing Steadfast order:", error);
      }
    }
    if (courier === "pathao") {
      try {
        const { name, phone, streetAddress, city, zone, area, totalCost } =
          order;

        const payload = {
          merchant_order_id: order._id,
          recipient_name: name,
          recipient_phone: phone,
          recipient_city: city.cityID,
          recipient_zone: zone.zoneID,
          delivery_type: 48,
          item_type: 2,
          item_quantity: order.products[0].quantity,
          item_weight: 0.5,
          amount_to_collect: totalCost,
          recipient_address: `${streetAddress}, ${area.areaName}, ${city.cityName}, ${zone.zoneName} `,
        };

        // Ensure you're sending the correct base URL
        const response = await axios.post(
          "/pathaoLocation/create-order",
          payload
        );

        // Update response checks to match the API response structure
        if (response?.data?.status === "success") {
          return message.success("Order placed with Pathao successfully"); // Ensure correct success message
        }
        if (response?.data?.status === "fail") {
          return message.error(
            response?.data?.message || "Failed to place order with Pathao"
          );
        }
      } catch (error) {
        message.error("Error placing order with Pathao");
        console.error("Error placing pathao order:", error);
      }
    }
  };

  const handlePrintInvoice = async (order) => {
    try {
      const response = await axios.get(`/order/${order._id}`);
      const anOrder = response?.data?.data?.doc;

      const invoiceWindow = window.open("", "_blank");

      const invoiceHTML = `
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body { font-family: Arial, sans-serif; }
              .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }
              .invoice-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .invoice-header h1 { margin: 0; }
              .invoice-details { margin-bottom: 20px; }
              .invoice-details p { margin: 0; }
              .invoice-products { width: 100%; border-collapse: collapse; }
              .invoice-products th, .invoice-products td { border: 1px solid #eee; padding: 10px; }
              .invoice-total { margin-top: 20px; text-align: right; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="invoice-box">
              <div class="invoice-header">
                <h1>Invoice</h1>
                <div>
                  <p>Order ID: ${anOrder._id.slice(-6)}</p>
                  <p>Date: ${new Date(
                    anOrder.createdAt
                  ).toLocaleDateString()}</p>
                </div>
              </div>
              <div class="invoice-details">
                <p>Name: ${anOrder.name}</p>
                <p>Phone: ${anOrder.phone}</p>
                <p>Email: ${anOrder.email}</p>
                
                <p>Address:${anOrder.streetAddress}, ${
        anOrder.area.areaName
      }, ${anOrder.city.cityName}, ${anOrder.zone.zoneName} </p>
              </div>
              <table class="invoice-products">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${anOrder.products
                    .map(
                      (product) => `
                      <tr>
                        <td>${product?.option?.product?.name || "N/A"}</td>
                        <td>${product?.option?.variant?.colorName || "N/A"}</td>
                        <td>${product?.option?.size || "N/A"}</td>
                        <td>${product?.quantity || "N/A"}</td>
                        <td>${product?.option?.price || "N/A"}</td>
                      </tr>
                    `
                    )
                    .join("")}
                </tbody>
              </table>
              <div class="invoice-total">
                <p>Total Cost: ${anOrder.totalCost}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      invoiceWindow.document.write(invoiceHTML);
      invoiceWindow.document.close();

      invoiceWindow.onload = () => {
        invoiceWindow.print();
        invoiceWindow.close();
      };
    } catch (error) {
      console.error("Error printing invoice:", error);
    }
  };

  const columns = [
    {
      title: "SR",
      dataIndex: "index",
      key: "sr",
      render: (text, record, index) => <a>{index + 1}</a>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (text) => {
        let paddedText = String(text);
        return paddedText.slice(-6).padStart(6, "0");
      },
    },

    {
      title: "Product Name",
      dataIndex: ["products", 0, "option", "product", "name"],
      key: "productName",
      render: (text) => <a>{text || "N/A"}</a>,
    },
    {
      title: "Price",
      dataIndex: "totalCost",
      key: "totalCost",
    },
    {
      title: "Quantity",
      dataIndex: ["products", 0, "quantity"],
      key: "quantity",
    },

    {
      title: "Color Name",
      dataIndex: ["products", 0, "option", "variant", "colorName"],
      key: "colorName",
    },
    {
      title: "Size",
      dataIndex: ["products", 0, "option", "size"],
      key: "size",
    },
    {
      title: "Information",
      dataIndex: "information",
      key: "information",
      render: (text, record) => (
        <div>
          <p>Name: {record.name}</p>
          <p>Phone: {record.phone}</p>
          <p>Email: {record.email}</p>
          <p>City: {record.city.cityName}</p>
          <p>
            Address:{" "}
            {`${record.streetAddress},${record.zone.zoneName}, ${record.area.areaName}`}
          </p>
        </div>
      ),
    },
    {
      width: "10%",
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (_, record) => (
        <Select
          className="w-[100%]"
          value={record.orderStatus} // Show current status
          onChange={(value) => handleStatusChange(record._id, value)}
          options={[
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Delivered", value: "delivered" },
            { label: "Shipped", value: "shipped" },
            { label: "Canceled", value: "canceled" },
          ]}
        />
      ),
    },
    {
      width: "15%",
      title: "Courier Service",
      dataIndex: "courier",
      key: "courier",
      render: (text, record) => (
        <Select
          className="w-[100%]"
          value={record.courier || "Select Courier"} // Show selected courier
          onChange={(value) => handleCourierChange(record, value)}
          options={[
            { label: "Steadfast", value: "Steadfast" },
            { label: "pathao", value: "pathao" },
          ]}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="primary" onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
          <Button type="primary" onClick={() => handlePrintInvoice(record)}>
            Print Invoice
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by Order ID or Phone"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            if (value.trim() === "") {
              setFilteredData([]);
              fetchOrders();
              return;
            }
          }}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </Space>

      {/* Table displaying data */}
      <Table
        columns={columns}
        dataSource={filteredData || data} // Use filteredData if available, otherwise fallback to all data
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal for editing order */}
      <Modal
        title="Edit Order"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={currentOrder}
        >
          <Form.Item label="Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city">
            <Input />
          </Form.Item>
          <Form.Item label="District" name="district">
            <Input />
          </Form.Item>
          <Form.Item label="Color Name" name="colorName">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Order;
