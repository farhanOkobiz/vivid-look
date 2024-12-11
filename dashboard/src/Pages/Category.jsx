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
} from "antd";
import axios from "../Components/Axios";
import { format } from "date-fns";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";

const AddCategory = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubCategoryModalVisible, setIsSubCategoryModalVisible] =
    useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [newSubCategoryTitle, setNewSubCategoryTitle] = useState("");
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [categoryExists, setCategoryExists] = useState(false); // new state
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [updateImagePreviewUrls, setUpdateImagePreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [variantFileList, setVariantFileList] = useState([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [form] = Form.useForm(); // form instance for better control

  const [newImageFile, setNewImageFile] = useState(null);
  const [categoryFileList, setCategoryFileList] = useState([]); // For category image files
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const categoryRes = await axios.get("/category");
      const subCategoryRes = await axios.get("/subCategory");

      const mergedData = categoryRes.data.data.doc.map((category, index) => {
        const subCategories = subCategoryRes.data.data.doc.filter(
          (sub) => sub.category === category._id
        );

        return {
          key: category._id,
          index: index + 1,
          category: category.title,
          subCategories: subCategories.map((sub) => ({
            key: sub._id,
            title: sub.title,
          })),
          subCategoryCount: subCategories.length,
          date: format(category.updatedAt, "dd-MM-yyyy"),
          photos: category?.photos,
        };
      });

      setDataSource(mergedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleDelete = async (key) => {
    try {
      await axios.delete(`/category/${key}`);
      setDataSource(dataSource.filter((item) => item.key !== key));
    } catch (error) {
      fetchData();
      console.error("Failed to delete category:", error);
    }
  };

  const categoryImageUploadProps = {
    fileList: categoryFileList,
    multiple: false,
    onRemove: (file) => {
      setCategoryFileList([]);
      setUpdateImagePreviewUrls([]); // Clear the preview since only one file is allowed
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/"); // Validate file type
      if (!isImage) {
        message.error(`${file.name} is not an image file!`);
        return Upload.LIST_IGNORE;
      }
      // Update the file list and generate preview
      setCategoryFileList([file]); // Only one file is allowed, replace the existing
      previewCategoryImage(file); // Generate and set the preview
      return false; // Prevent automatic upload
    },
  };

  // update New Priview
  const previewCategoryImage = (file) => {
    const reader = new FileReader();
    setCurrentImage(file);
    reader.onload = (e) => {
      // console.log(e.target.result, "..........result");
      setUpdateImagePreviewUrls([e.target.result]); // Update preview (single file)
    };
    reader.readAsDataURL(file); // Read the file as Data URL
  };

  const handleSubCategoryEdit = (subCategory) => {
    console.log(subCategory);
    setCurrentSubCategory(subCategory);
    setNewSubCategoryTitle(subCategory.title);
    setIsSubCategoryModalVisible(true);
  };

  const handleSubCategorySave = async () => {
    if (currentSubCategory) {
      try {
        await axios.patch(`/subCategory/${currentSubCategory.key}`, {
          title: newSubCategoryTitle,
        });
        setIsSubCategoryModalVisible(false);

        setCurrentSubCategory(null);
        fetchData();
        message.success("Subcategory updated successfully");
      } catch (error) {
        console.error("Failed to save subcategory changes:", error);
        message.error("Failed to update subcategory");
      }
    }
  };

  const handleCategoryEdit = (record) => {
    setCurrentCategory(record);
    setNewCategoryTitle(record.category || "");
    setUpdateImagePreviewUrls(record.photos || []);
    // setNewImageFile(null);
    setIsModalVisible(true);
  };

  const handleCategorySave = async () => {
    try {
      const formData = new FormData();

      // Append the category title as JSON
      if (currentCategory) {
        formData.append("title", newCategoryTitle);
      }
      if (currentImage?.file) {
        formData.append("photos", currentImage?.file);
      }
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
    const { title: categoryTitle, subtitle: subCategoryTitle } =
      values.category;

    const formData = new FormData();
    formData.append("title", categoryTitle);
    if (!categoryExists && variantFileList?.length <= 0) {
      setImageError(true);
      return;
    }

    variantFileList.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const existingCategoryRes = await axios.get("/category", {
        params: { title: categoryTitle },
      });

      let categoryId;
      if (existingCategoryRes.data.data.doc.length > 0) {
        categoryId = existingCategoryRes.data.data.doc[0]._id;
      } else {
        // Create a new category and get the ID
        // console.log(formData);
        const newCategoryRes = await axios.post("/category", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Response from server:", newCategoryRes.data);

        categoryId = newCategoryRes.data.data.product._id;
      }

      // Add the subcategory associated with the category
      await axios.post("/subCategory", {
        title: subCategoryTitle,
        category: categoryId,
      });

      fetchData();
      message.success("Category and Subcategory created successfully!");
    } catch (error) {
      console.error("Failed to add category and subcategory:", error);
      message.error("Failed to add category and subcategory.");
    }
  };

  const handleCategorySearch = async (value) => {
    if (value) {
      const res = await axios.get("/category", {
        params: { title: value },
      });

      const existingCategory = res.data.data.doc.length > 0;
      setCategoryExists(existingCategory);

      if (!existingCategory) {
        form.setFieldsValue({
          icon: "",
          colorCode: { iconColor: "", bgColor: "" },
        });
      }

      setCategorySuggestions(res.data.data.doc.map((cat) => cat.title));
    } else {
      setCategorySuggestions([]);
    }
  };

  const variantUploadProps = {
    fileList: variantFileList,
    multiple: true,
    onRemove: (file) => {
      const index = variantFileList.indexOf(file); // Get the index of the file
      if (index !== -1) {
        // Remove the file from the file list
        setVariantFileList((prevList) => {
          const newFileList = [...prevList];
          newFileList.splice(index, 1);
          return newFileList;
        });
        setImageError(false);
        // Remove the corresponding preview from imagePreviewUrls
        setImagePreviewUrls((prevPreviews) => {
          const newPreviews = [...prevPreviews];
          newPreviews.splice(index, 1); // Remove the preview at the same index
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
      // Add the file to the file list
      setVariantFileList((prevList) => [...prevList, file]);
      handleImagePreview({ originFileObj: file }); // Call preview handler for image preview
      return false;
    },
  };

  const handleImagePreview = (file) => {
    if (file && file.originFileObj) {
      // Check if the file is valid
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

              <Form.Item
                name={["category", "subtitle"]}
                label="Sub Category"
                rules={[
                  {
                    required: true,
                    message: "Please input subcategory title!",
                  },
                ]}
              >
                <Input placeholder="Enter subcategory title" />
              </Form.Item>

              {/* <h1>Product image</h1> */}

              {!categoryExists && (
                <>
                  <Dragger
                    {...variantUploadProps}
                    onChange={handleImagePreview}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag category Image to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload.
                    </p>
                  </Dragger>
                  {imageError && (
                    <p className="text-red-500 text-center mt-2">
                      Image upload is required.
                    </p>
                  )}
                  <div className="flex gap-x-5 justify-center">
                    {/* Image preview here */}
                    {imagePreviewUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt="Preview"
                        className="w-[150px] h-[150px] object-cover rounded-md shadow-lg"
                      />
                    ))}
                  </div>
                </>
              )}

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
                },
                {
                  title: "Category Name",
                  dataIndex: "category",
                  width: "20%",
                },
                {
                  title: "SubCategory Names",
                  dataIndex: "subCategories",
                  width: "30%",
                  render: (subCategories) =>
                    subCategories.length > 0
                      ? subCategories.map((sub) => (
                          <div key={sub.key}>
                            {sub.title}
                            <Button
                              type="link"
                              onClick={() => handleSubCategoryEdit(sub)}
                              style={{ marginRight: 8 }}
                            >
                              Edit
                            </Button>
                          </div>
                        ))
                      : "No SubCategory",
                },
                {
                  title: "Category Image",
                  dataIndex: "photos",
                  width: "10%",
                  render: (photos) =>
                    photos && photos.length > 0 ? (
                      <img
                        src={photos[0]} // Display the first image in the array
                        alt="Category"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px", // Optional: adds a rounded corner
                        }}
                      />
                    ) : (
                      "No Image"
                    ),
                },

                {
                  title: "SubCategory Count",
                  dataIndex: "subCategoryCount",
                  width: "10%",
                },
                {
                  title: "Date",
                  dataIndex: "date",
                },
                {
                  title: "Operation",
                  dataIndex: "operation",
                  width: "15%",
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
                          onConfirm={() => handleDelete(record.key)}
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
        title="Edit SubCategory"
        visible={isSubCategoryModalVisible}
        onOk={handleSubCategorySave}
        onCancel={() => setIsSubCategoryModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Input
          value={newSubCategoryTitle}
          onChange={(e) => setNewSubCategoryTitle(e.target.value)}
        />
      </Modal>

      <Modal
        title="Edit Category "
        visible={isModalVisible}
        onOk={handleCategorySave}
        onCancel={() => setIsModalVisible(false)}
      >
        <div>
          <p>Enter Category : </p>
          <Input
            className="mb-2"
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
          />
        </div>

        <>
          <p>Upload New Category Image:</p>
          <Dragger
            {...categoryImageUploadProps}
            onChange={previewCategoryImage}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag category Image to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload.
            </p>
          </Dragger>

          <div className="flex gap-x-5 justify-center">
            {/* Image preview here */}
            {updateImagePreviewUrls.map((url, index) => (
              <img
                // onChange={setNewCategoryImage(e.target.value)}
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
