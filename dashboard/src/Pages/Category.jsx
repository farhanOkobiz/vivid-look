import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Form,
  Popconfirm,
  Table,
  AutoComplete,
  Modal,
  message,
  Switch,
  Upload,
} from "antd";
import axios from "../Components/Axios";
import { format } from "date-fns";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";

const AddCategory = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [variantFileList, setVariantFileList] = useState([]);
  const [updateImagePreviewUrls, setUpdateImagePreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [form] = Form.useForm();
  const [newCategoryIndex, setNewCategoryIndex] = useState(1);
  const [newImageFile, setNewImageFile] = useState(null);
  const [categoryFileList, setCategoryFileList] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const categoryRes = await axios.get("/category");
      const mergedData = categoryRes.data.data.doc.map((category, index) => {
        return {
          key: category._id,
          index: category.index,
          isActive: category.isActive,
          category: category.title,
          date: format(category.updatedAt, "dd-MM-yyyy"),
          photos: category?.photos,
        };
      });

      setDataSource(mergedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleDelete = async (type, key) => {
    try {
      await axios.delete(`/${type}/${key}`);
      setDataSource(dataSource.filter((item) => item.key !== key));
      message.success(`${type} deleted successfully!`);
    } catch (error) {
      fetchData();
      console.error(`Failed to delete ${type}:`, error);
    }
  };

  const categoryImageUploadProps = {
    fileList: categoryFileList,
    multiple: false,
    onRemove: (file) => {
      setCategoryFileList([]);
      setUpdateImagePreviewUrls([]);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} is not an image file!`);
        return Upload.LIST_IGNORE;
      }
      setCategoryFileList([file]);
      previewCategoryImage(file);
      return false;
    },
  };

  const previewCategoryImage = (file) => {
    const reader = new FileReader();
    setCurrentImage(file);
    reader.onload = (e) => {
      setUpdateImagePreviewUrls([e.target.result]);
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryEdit = (record) => {
    setCurrentCategory(record);
    setNewCategoryTitle(record.category || "");
    setNewCategoryIndex(record.index || 1);
    setIsActive(record.isActive || false);
    setUpdateImagePreviewUrls(record.photos || []);
    setIsModalVisible(true);
  };

  const handleCategorySave = async () => {
    try {
      const formData = new FormData();

      if (currentCategory) {
        formData.append("title", newCategoryTitle);
        formData.append("index", newCategoryIndex);
      }
      if (currentImage?.file) {
        formData.append("photos", currentImage?.file);
      }
      formData.append("isActive", isActive);

      const res = await axios.patch(
        `/category/${currentCategory.key}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsModalVisible(false);
      message.success("Category updated successfully");
      fetchData();
    } catch (error) {
      console.error("Failed to update category:", error);
      message.error("Failed to update category");
    }
  };

  const onFinish = async (values) => {
    const { title: categoryTitle } = values.category;

    const formData = new FormData();
    formData.append("title", categoryTitle);

    // Append files if they exist
    if (variantFileList.length > 0) {
      variantFileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("photos", file.originFileObj); // Append the actual file
          console.log("File appended to FormData:", file.originFileObj); // Debugging
        } else {
          console.error("Invalid file:", file);
        }
      });
    } else {
      message.error("Image upload is required!"); // Show error message for missing image
      return;
    }

    try {
      const response = await axios.post("/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct content type
        },
      });

      console.log("Server response:", response.data); // Log the server response

      // Check if the response indicates a failure
      if (response.data.status === "fail") {
        // Show an error message from the server
        message.error(response.data.message || "Category title already exists.");
        return; // Stop further execution
      }

      fetchData();
      message.success("Category created successfully!"); // Show success message

      form.resetFields();
      setVariantFileList([]);
      setImagePreviewUrls([]);
    } catch (error) {
      console.error("Failed to add category:", error);

      // Handle specific error messages from the server
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Failed to add category."); // Show error message
      } else {
        message.error("Failed to add category."); // Show generic error message
      }
    }
  };

  const handleCategorySearch = async (value) => {
    if (value) {
      const res = await axios.get("/category", {
        params: { title: value }, // Send the search term to the server
      });

      console.log("Server response:", res.data.data.doc); // Log the server response

      // Update the dropdown options with the matching category titles
      setCategorySuggestions(res.data.data.doc.map((cat) => cat.title));
    } else {
      // If the search term is empty, reset the dropdown options
      setCategorySuggestions([]);
    }
  };

  const variantUploadProps = {
    fileList: variantFileList,
    multiple: true,
    onRemove: (file) => {
      const index = variantFileList.indexOf(file);
      if (index !== -1) {
        setVariantFileList((prevList) => {
          const newFileList = [...prevList];
          newFileList.splice(index, 1);
          return newFileList;
        });
        setImageError(false);
        setImagePreviewUrls((prevPreviews) => {
          const newPreviews = [...prevPreviews];
          newPreviews.splice(index, 1);
          return newPreviews;
        });
      }
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} is not an image file!`);
        return Upload.LIST_IGNORE;
      }
      console.log("File to upload:", file); // Debugging
      setVariantFileList((prevList) => [...prevList, file]);
      handleImagePreview({ originFileObj: file });
      return false;
    },
  };

  const handleImagePreview = (file) => {
    if (file && file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file.originFileObj);
      setImageError(false);
    }
  };

  return (
    <>
      <h2 className="text-center font-semibold md:text-2xl text-xl py-10">
        Add Category
      </h2>

      <Row gutter={16}>
        <Col span={8}>
          <Card title="Add Category" className="text-center" bordered={false}>
            <Form
              form={form}
              name="form_item_path"
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name={["category", "title"]}
                label="Category"
                rules={[
                  { required: true, message: "Please input category title!" },
                ]}
              >
                <AutoComplete
                  onSearch={handleCategorySearch}
                  options={categorySuggestions.map((suggestion) => ({
                    value: suggestion,
                  }))}
                  placeholder="Enter category title"
                />
              </Form.Item>

              <Dragger {...variantUploadProps} onChange={handleImagePreview}>
                <div>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag category Image to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload.
                  </p>
                </div>
              </Dragger>
              {imageError && (
                <p className="text-red-500 text-center mt-2">
                  Image upload is required.
                </p>
              )}
              <div className="flex gap-x-5 justify-center">
                {imagePreviewUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="Preview"
                    className="w-[150px] h-[150px] object-cover rounded-md shadow-lg"
                  />
                ))}
              </div>

              <Button className="mt-4" type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </Card>
        </Col>

        <Col span={16}>
          <Card title="All Categories" bordered={false}>
            <Table
              bordered
              dataSource={dataSource}
              columns={[
                {
                  title: "SL",
                  dataIndex: "index",
                  width: "5%",
                  align: "center",
                },
                {
                  title: "Category Name",
                  dataIndex: "category",
                  width: "20%",
                  align: "left",
                },
                {
                  title: "Category Image",
                  dataIndex: "photos",
                  width: "15%",
                  align: "center",
                  render: (photos) =>
                    photos && photos.length > 0 ? (
                      <img
                        src={photos[0]}
                        alt="Category"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      "No Image"
                    ),
                },
                {
                  title: "Active Status",
                  dataIndex: "isActive",
                  key: "isActive",
                  width: "10%",
                  align: "center",
                  render: (isActive) => (
                    <Switch checked={isActive} disabled size="small" />
                  ),
                },
                {
                  title: "Operation",
                  dataIndex: "operation",
                  width: "15%",
                  align: "center",
                  render: (_, record) =>
                    dataSource.length >= 1 ? (
                      <>
                        <Button
                          type="link"
                          onClick={() => handleCategoryEdit(record)}
                          style={{ marginRight: 8 }}
                        >
                          Edit
                        </Button>
                        <Popconfirm
                          title="Sure to delete?"
                          onConfirm={() => handleDelete(`category`, record.key)}
                        >
                          <Button type="link" danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      </>
                    ) : null,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Edit Category"
        visible={isModalVisible}
        onOk={handleCategorySave}
        onCancel={() => setIsModalVisible(false)}
      >
        <div>
          <p>Category Title:</p>
          <Input
            className="mb-2"
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            placeholder="Enter category title"
          />
        </div>

        <div>
          <p>Category Index:</p>
          <Input
            type="number"
            className="mb-2"
            value={newCategoryIndex}
            onChange={(e) => setNewCategoryIndex(Number(e.target.value))}
            min={1}
            max={dataSource.length}
            placeholder="Enter category position"
          />
        </div>

        <div className="my-3">
          <p>Active (enable করুন):</p>
          <Switch
            checked={isActive}
            onChange={(checked) => setIsActive(checked)}
          />
        </div>

        <>
          <p>Upload New Category Image:</p>
          <Dragger
            {...categoryImageUploadProps}
            onChange={(info) => {
              if (info.file.status === "done") {
                const file = info.file.originFileObj;
                setCurrentImage({ file });
              }
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag category image to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for single or bulk upload.
            </p>
          </Dragger>

          <div className="flex gap-x-5 justify-center mt-4">
            {updateImagePreviewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Preview"
                className="w-[150px] h-[150px] object-cover rounded-md shadow-lg"
              />
            ))}
          </div>
        </>
      </Modal>
    </>
  );
};

export default AddCategory;