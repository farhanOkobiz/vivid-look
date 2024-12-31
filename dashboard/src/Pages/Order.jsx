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
import logo from "../assets/logos/logoBlack.jpg";

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
      setFilteredData(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // console.log(data, ".......");
  useEffect(() => {
    fetchOrders();
  }, []);

  const calculateDeliveryCharge = (shippingCost, isFreeShipping) => {
    if (isFreeShipping) return 0;
    return shippingCost;
  };

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
        const { name, phone, streetAddress, totalCost } = order;
        const invoice = `${order._id.slice(-6)}`;

        const payload = {
          invoice,
          recipient_name: name,
          recipient_phone: phone,
          recipient_address: `${streetAddress}`,
          cod_amount: totalCost,
        };

        const response = await axios.post(
          "https://portal.packzy.com/api/v1/create_order",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              "Api-Key": "mstshryvc9q8bkrz3iu431uuvo2c39tv",
              "Secret-Key": "iksacduggxpserl2x9nh6str",
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
    // if (courier === "pathao") {
    //   try {
    //     const { name, phone, streetAddress, city, zone, area, totalCost } =
    //       order;

    //     const payload = {
    //       merchant_order_id: order._id,
    //       recipient_name: name,
    //       recipient_phone: phone,
    //       recipient_city: city.cityID,
    //       recipient_zone: zone.zoneID,
    //       delivery_type: 48,
    //       item_type: 2,
    //       item_quantity: order.products[0].quantity,
    //       item_weight: 0.5,
    //       amount_to_collect: totalCost,
    //       recipient_address: `${streetAddress}`,
    //     };

    //     // Ensure you're sending the correct base URL
    //     const response = await axios.post(
    //       "/pathaoLocation/create-order",
    //       payload
    //     );

    //     // Update response checks to match the API response structure
    //     if (response?.data?.status === "success") {
    //       return message.success("Order placed with Pathao successfully"); // Ensure correct success message
    //     }
    //     if (response?.data?.status === "fail") {
    //       return message.error(
    //         response?.data?.message || "Failed to place order with Pathao"
    //       );
    //     }
    //   } catch (error) {
    //     message.error("Error placing order with Pathao");
    //     console.error("Error placing pathao order:", error);
    //   }
    // }
  };

  const handlePrintInvoice = async (order) => {
    try {
      const response = await axios.get(`/order/${order._id}`);
      const anOrder = response?.data?.data?.doc;

      // console.log(anOrder, ".......AnOrder......");

      const isFreeShipping = anOrder.products.every(
        (product) => product.option?.freeShipping === true
      );

      const deliveryCharge = isFreeShipping ? 0 : anOrder.shippingCost;

      const invoiceWindow = window.open("", "_blank");

      const invoiceHTML = `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }

    .invoice-box {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
      border: 1px solid #ddd;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
     
    }

    .header h1 {
      font-size: 28px;
      margin: 0;
      color: #333;
    }

    .header img{
     margin-top:20px;
    }

.header p{
 margin:0;
}
    .header .company-info {
      font-size: 16px;
      color: #666;
      margin-top: 3px;
      
    }

    .invoice-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .invoice-details p {
      margin: 0;
      font-size: 14px;
    }

    .bill-to {
      margin-bottom: 20px;
    }

    .bill-to p {
      margin: 5px 0;
      font-size: 14px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    table th, table td {
      border: 1px solid #ddd;
      padding: 8px;
      font-size: 14px;
    }

    table th {
      background: #f2f2f2;
      text-align: left;
    }

    .total {
      text-align: right;
      margin-top: 10px;
      font-size: 16px;
      font-weight: bold;
    }

    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }

    .footer p{
    margin:0;
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="header">
      <h1>INVOICE</h1>
      <img src=${logo} alt="Company Logo" width="120" />
      <p class="company-info">Address: 136/3 mazar co-paretive market, mirpur-1, Dhaka-1216</p>
      <p class="company-info">Phone: 01954218918 | Email: tech10mirpur@gmail.com</p>
    </div>

    <div class="invoice-details">
      <div>
        <p><strong>BILL TO:</strong></p>
        <p>Name: ${anOrder.name}</p>
        <p>Address: ${anOrder.streetAddress}</p>
        <p>Phone: ${anOrder.phone}</p>
        <p>Email: ${anOrder.email}</p>
      </div>
      <div>
        <p><strong>Invoice #:</strong> ${anOrder._id.slice(-6)}</p>
        <p><strong>Date:</strong>  ${new Date(
          anOrder.createdAt
        ).toLocaleDateString()}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Product</th>
              <th>Color</th>
              <th>Size</th>              
              <th>Quantity</th>
             <th>Total Price</th>
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
                        <td>
                          ${
                            product?.option?.salePrice
                              ? Math.round(
                                  product.option.salePrice * product.quantity
                                ) // salePrice যদি থাকে
                              : Math.round(
                                  product.option.price * product.quantity
                                ) // salePrice না থাকলে price
                          }
                        </td>
                      </tr>
                    `
          )
          .join("")}
      </tbody>

      <tfoot>
        <tr class="total-row">
          <td colspan="4">Total</td>
          <td>${Math.round(anOrder.totalCost - deliveryCharge)} Taka</td>
        </tr>
        <tr class="total-row">
          <td colspan="4">Delivery Charge</td>
          <td>${
            deliveryCharge === 0 ? "Free Shipping" : `${deliveryCharge} Taka`
          }</td>
        </tr>
        <tr class="total-row">
          <td colspan="4"><strong>Grand Total</strong></td>
          <td><strong> ${Math.round(anOrder.totalCost)}  Taka</strong></td>
        </tr>
      </tfoot>
    </table>


    <div class="footer">
      <p>Thank you for your order!</p>
      <p>If you have any questions about this invoice, please contact</p>
      <p>Tech10, Phone: 01954218918, Email: tech10mirpur@gmail.com</p>
      
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
      dataIndex: "products",
      key: "productName",
      render: (products) => (
        <ul>
          {products && products.length > 0
            ? products.map((product, index) => (
                <li
                  key={index}
                  className={`my-2 p-2 ${
                    index !== products.length - 1 ? "border-b" : ""
                  }`}
                >
                  <a>{product?.option?.product?.name || "N/A"}</a>
                </li>
              ))
            : "N/A"}
        </ul>
      ),
    },

    {
      title: "Price",
      dataIndex: "products",
      key: "products",
      render: (text, record) => {
        return record.products.map((product, index) => {
          const price = product?.option?.salePrice || product?.option?.price;

          return (
            <ul key={product._id}>
              <li
                key={index}
                className={`my-2 p-2 ${
                  index !== record.products.length - 1 ? "border-b" : ""
                }`}
              >
                {Math.round(price)} Taka
              </li>
            </ul>
          );
        });
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (text, record) => {
        const isFreeShipping = record.products.every(
          (product) => product.option?.freeShipping === true
        );
        const shippingCost = calculateDeliveryCharge(
          record.shippingCost,
          isFreeShipping
        );

        const priceAfterShipping = Math.round(record.totalCost - shippingCost);

        return `${priceAfterShipping} Taka`;
      },
    },
    {
      title: "Delivery Charge",
      key: "deliveryCharge",
      render: (text, record) => {
        const deliveryCharge = calculateDeliveryCharge(
          record.shippingCost,
          (record.isFreeShipping = record.products.every(
            (product) => product.option?.freeShipping === true
          ))
        );

        return deliveryCharge === 0
          ? "Free Shipping"
          : `${deliveryCharge} Taka`;
      },
    },

    {
      title: "Quantity",
      dataIndex: "products",
      key: "quantity",
      render: (products) => {
        const totalQuantity = products
          ? products.reduce((sum, product) => sum + (product?.quantity || 0), 0)
          : 0;

        return totalQuantity > 0 ? totalQuantity : "N/A";
      },
    },
    {
      title: "Color Name",
      dataIndex: "products",
      key: "colorName",
      render: (products) => (
        <div>
          {products && products.length > 0
            ? products.map((product, index) => (
                <div
                  key={index}
                  className={`my-2 p-2 ${
                    index !== products.length - 1 ? "border-b" : ""
                  }`}
                >
                  {product?.option?.variant?.colorName || "N/A"}
                </div>
              ))
            : "N/A"}
        </div>
      ),
    },
    {
      title: "Size",
      dataIndex: "products",
      key: "size",
      render: (products) => (
        <ul>
          {products && products.length > 0
            ? products.map((product, index) => (
                <li
                  className={`my-2 p-2 ${
                    index !== products.length - 1 ? "border-b" : ""
                  }`}
                  key={index}
                >
                  {product?.option?.size || "N/A"}
                </li>
              ))
            : "N/A"}
        </ul>
      ),
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
          {/* <p>City: {record.city.cityName}</p> */}
          <p>Address: {`${record.streetAddress}`}</p>
          <p>Note: {`${record?.notes}`}</p>
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
            { label: "Shipped", value: "shipped" },
            { label: "Delivered", value: "delivered" },
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
            // { label: "pathao", value: "pathao" },
          ]}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div className="flex flex-col gap-2">
          <button
            className="bg-green-500 text-white w-24 py-1"
            type="primary"
            onClick={() => handleEdit(record)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white w-24 py-1"
            type="primary"
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </button>
          <button
            className="bg-blue-900 text-white w-24 py-1"
            type="primary"
            onClick={() => handlePrintInvoice(record)}
          >
            Print Invoice
          </button>
        </div>
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
          <Form.Item label="Address" name="streetAddress">
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
