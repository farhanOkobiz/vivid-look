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
  const [newSubCategoryIndex, setNewSubCategoryIndex] = useState("");
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [categoryExists, setCategoryExists] = useState(false); // new state
  // category
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [variantFileList, setVariantFileList] = useState([]);
  const [updateImagePreviewUrls, setUpdateImagePreviewUrls] = useState([]);
  // sub categories
  const [imageSubCategoryPreviewUrls, setSubCategoryImagePreviewUrls] =
    useState([]);
  const [
    updateSubCategoryImagePreviewUrls,
    setSubCategoryUpdateImagePreviewUrls,
  ] = useState([]);
  const [variantSubCategoryFileList, setSubCategoryVariantFileList] = useState(
    []
  );

  const [loading, setLoading] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentSubCategoryImage, setCurrentSubCategoryImage] = useState(null);
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [form] = Form.useForm(); // form instance for better control
  const [newCategoryIndex, setNewCategoryIndex] = useState(1);

  const [newImageFile, setNewImageFile] = useState(null);
  const [categoryFileList, setCategoryFileList] = useState([]); // For category image files
  const [subCategoryFileList, setSubCategoryFileList] = useState([]); // For category image files
  const [imageError, setImageError] = useState(false);
  const [isActive, setIsActive] = useState(false); // Default to false
  const [isSubCategoryActive, setIsSubCategoryActive] = useState(false); // Default to inactive

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
          index: category.index,
          isActive: category.isActive,
          category: category.title,
          subCategories: subCategories.map((sub) => ({
            index: sub?.index,
            key: sub._id,
            title: sub.title,
            isActive: sub.isActive,
            photos: sub.photos,
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

  console.log("Full Details", dataSource);

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

  const subCategoryImageUploadProps = {
    fileList: subCategoryFileList,
    multiple: false,
    onRemove: (file) => {
      setSubCategoryFileList([]);
      setSubCategoryUpdateImagePreviewUrls([]); // Clear the preview since only one file is allowed
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/"); // Validate file type
      if (!isImage) {
        message.error(`${file.name} is not an image file!`);
        return Upload.LIST_IGNORE;
      }
      // Update the file list and generate preview
      setSubCategoryFileList([file]); // Only one file is allowed, replace the existing
      previewSubCategoryImage(file); // Generate and set the preview
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

  const previewSubCategoryImage = (file) => {
    const reader = new FileReader();
    setCurrentSubCategoryImage(file);
    reader.onload = (e) => {
      // console.log(e.target.result, "..........result");
      setSubCategoryUpdateImagePreviewUrls([e.target.result]); // Update preview (single file)
    };
    reader.readAsDataURL(file); // Read the file as Data URL
  };

  const handleSubCategoryEdit = (record) => {
    console.log(record);
    setCurrentSubCategory(record);
    setNewSubCategoryTitle(record.title || ""); // Set title
    setNewSubCategoryIndex(record.index || ""); // Set index
    setIsSubCategoryActive(record.isActive || false); // Set isActive
    setSubCategoryUpdateImagePreviewUrls(record.photos || []); // Set images
    setIsSubCategoryModalVisible(true);
  };


  const handleSubCategorySave = async () => {
    try {
      const formData = new FormData();

      // Append the subcategory title
      if (currentSubCategory) {
        formData.append("title", newSubCategoryTitle);
        formData.append("index", newSubCategoryIndex);
        console.log("Title updated");
      }
      
      // Append the subcategory image
      if (currentSubCategoryImage?.file) {
        formData.append("photos", currentSubCategoryImage.file);
        console.log("Photos updated");
      }

      // Append the isActive state
      formData.append("isActive", isSubCategoryActive);

      const res = await axios.patch(
        `/subCategory/${currentSubCategory.key}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsSubCategoryModalVisible(false);
      message.success("Subcategory updated successfully");
      fetchData();
    } catch (error) {
      console.error("Failed to update subcategory:", error);
      message.error("Failed to update subcategory");
    }
  };

  const handleCategoryEdit = (record) => {
    setCurrentCategory(record);
    setNewCategoryTitle(record.category || "");
    setNewCategoryIndex(record.index || 1); // Assuming an index exists
    setIsActive(record.isActive || false); // Set the initial isActive state
    setUpdateImagePreviewUrls(record.photos || []);
    setIsModalVisible(true);
  };

  const handleCategorySave = async () => {
    try {
      const formData = new FormData();

      if (currentCategory) {
        formData.append("title", newCategoryTitle);
        formData.append("index", newCategoryIndex); // Save category index
      }
      if (currentImage?.file) {
        formData.append("photos", currentImage?.file);
      }
      formData.append("isActive", isActive); // Append isActive state

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
      const formDataSubCateory = new FormData();
      formDataSubCateory.append("title", subCategoryTitle);
      formDataSubCateory.append("category", categoryId);
      variantSubCategoryFileList.forEach((file) => {
        formDataSubCateory.append("photos", file);
      });
      // Add the subcategory associated with the category
      await axios.post("/subCategory", formDataSubCateory, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      fetchData();
      message.success("Category and Subcategory created successfully!");

      form.resetFields();
      setVariantFileList([]);
      setSubCategoryVariantFileList([]);
      setImagePreviewUrls([]);
      setSubCategoryImagePreviewUrls([]);
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
      console.log("variantUploadProps onRemove");
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
      console.log("variantUploadProps beforeUpload");
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

  const variantSubCategoryUploadProps = {
    fileList: variantSubCategoryFileList,
    multiple: true,
    onRemove: (file) => {
      console.log("variantSubCategoryUploadProps reomve");
      const index = variantSubCategoryFileList.indexOf(file); // Get the index of the file
      if (index !== -1) {
        // Remove the file from the file list
        setSubCategoryVariantFileList((prevList) => {
          const newFileList = [...prevList];
          newFileList.splice(index, 1);
          return newFileList;
        });
        setImageError(false);
        // Remove the corresponding preview from imagePreviewUrls
        setSubCategoryImagePreviewUrls((prevPreviews) => {
          const newPreviews = [...prevPreviews];
          newPreviews.splice(index, 1); // Remove the preview at the same index
          return newPreviews;
        });
      }
    },
    beforeUpload: (file) => {
      console.log("variantSubCategoryUploadProps beforeUpload");
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error(`${file.name} is not an image file!`);
        return Upload.LIST_IGNORE;
      }
      // Add the file to the file list setUpdateImagePreviewUrls
      setSubCategoryVariantFileList((prevList) => [...prevList, file]);
      handleSubCategoryImagePreview({ originFileObj: file }); // Call preview handler for image preview
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

  const handleSubCategoryImagePreview = (file) => {
    if (file && file.originFileObj) {
      // Check if the file is valid
      const reader = new FileReader();
      reader.onload = (e) => {
        setSubCategoryImagePreviewUrls((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file.originFileObj);
      setImageError(false);
    }
  };

  const handleToggleSubCategory = (key, enabled) => {
    // Handle the toggle logic here (e.g., update the state or make an API call)
    console.log(
      `Subcategory with key ${key} is now ${enabled ? "enabled" : "disabled"}`
    );
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

              {!categoryExists && (
                <>
                  <Dragger
                    {...variantUploadProps}
                    onChange={handleImagePreview}
                  >
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

              <div>
                <Dragger
                  {...variantSubCategoryUploadProps}
                  onChange={handleSubCategoryImagePreview}
                >
                  <div>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag subcategory Image to this area to upload
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
                  {imageSubCategoryPreviewUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt="Preview"
                      className="w-[150px] h-[150px] object-cover rounded-md shadow-lg"
                    />
                  ))}
                </div>
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
                  render: (subCategories) => {
                    console.log("subCategories ==========", subCategories);
                    return subCategories && subCategories.length > 0
                      ? subCategories.map((sub) => (
                          <div
                            key={sub._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: 8,
                            }}
                          >
                            {/* Display Subcategory Photo */}
                            {sub.photos && sub.photos.length > 0 ? (
                              <img
                                src={sub.photos[0]} // Display the first photo
                                alt={sub.title || "SubCategory"} // Fallback alt text
                                style={{
                                  width: 50,
                                  height: 50,
                                  objectFit: "cover",
                                  marginRight: 8,
                                  borderRadius: 4,
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 50,
                                  height: 50,
                                  backgroundColor: "#f0f0f0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginRight: 8,
                                  borderRadius: 4,
                                }}
                              >
                                No Image
                              </div>
                            )}
                            {/* Subcategory Details */}
                            <div>
                              <div style={{ fontWeight: "bold" }}>
                                <span className="pr-2">{sub?.index}.</span>
                                {sub.title}
                              </div>

                              <Switch
                                checked={sub.isActive}
                                onChange={(checked) =>
                                  handleToggleSubCategory(sub.key, checked)
                                }
                                style={{ marginTop: 4, marginBottom: 4 }}
                                disabled
                              />

                              <Button
                                type="link"
                                onClick={() => handleSubCategoryEdit(sub)}
                                style={{ marginTop: 4 }}
                              >
                                Edit
                              </Button>

                              <Popconfirm
                                title="Sure to delete?"
                                onConfirm={() =>
                                  handleDelete(`subcategory`, sub.key)
                                }
                              >
                                <Button type="link" danger>
                                  Delete
                                </Button>
                              </Popconfirm>
                            </div>
                          </div>
                        ))
                      : "No SubCategory";
                  },
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
                  title: "Active Status",
                  dataIndex: "isActive",
                  key: "isActive",
                  render: (isActive) => <Switch checked={isActive} disabled />,
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
        title="Edit Sub Category"
        visible={isSubCategoryModalVisible}
        onOk={handleSubCategorySave}
        onCancel={() => setIsSubCategoryModalVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        {/* Edit Subcategory Title */}
        <div>
          <p>Subcategory Title:</p>
          <Input
            className="mb-2"
            value={newSubCategoryTitle}
            onChange={(e) => setNewSubCategoryTitle(e.target.value)}
            placeholder="Enter subcategory title"
          />
        </div>
        <div>
          <p>Subcategory Title:</p>
          <Input
            type="number"
            className="mb-2"
            value={newSubCategoryIndex}
            onChange={(e) => setNewSubCategoryIndex(e.target.value)}
            placeholder="Enter subcategory Index"
          />
        </div>
        {/* Active Status Switch */}
        <div>
          <p>Active (enable করুন):</p>
          <Switch
            checked={isSubCategoryActive} // Bind the Switch to the isSubCategoryActive state
            onChange={(checked) => setIsSubCategoryActive(checked)} // Update isSubCategoryActive state on toggle
          />
        </div>

        {/* Image Upload and Preview */}
        <>
          <p>Upload New Subcategory Image:</p>
          <Dragger
            {...subCategoryImageUploadProps}
            onChange={previewSubCategoryImage}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag subcategory image to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload.
            </p>
          </Dragger>

          {/* Image Preview */}
          <div className="flex gap-x-5 justify-center mt-4">
            {updateSubCategoryImagePreviewUrls.map((url, index) => (
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

      <Modal
        title="Edit Category"
        visible={isModalVisible}
        onOk={handleCategorySave}
        onCancel={() => setIsModalVisible(false)}
      >
        {/* Edit Category Title */}
        <div>
          <p>Category Title:</p>
          <Input
            className="mb-2"
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            placeholder="Enter category title"
          />
        </div>

        {/* Edit Category Index */}
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

        {/* Active Status Switch */}
        <div className="my-3">
          <p>Active (enable করুন):</p>
          <Switch
            checked={isActive}
            onChange={(checked) => setIsActive(checked)}
          />
        </div>

        {/* Image Upload and Preview */}
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
            {/* Image Preview */}
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
