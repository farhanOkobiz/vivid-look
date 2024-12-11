const fs = require("fs").promises;
const path = require("path");
const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/AppError");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const Brand = require("../models/brandModel");
const Product = require("../models/productModel");
const Variant = require("../models/variantModel");
const Option = require("../models/optionModel");
const catchAsync = require("../utils/catchAsync");
const deleteFile = require("../utils/deleteFile");
const {
  createOne,
  getAll,
  getOne,
  updateOne,
} = require("../utils/handleFactory");

// exports.createCategoryController = createOne(Category);
exports.createCategoryController = catchAsync(async (req, res, next) => {
  console.log(req.body,"Request Body.......")
  const body = { ...req.body };

  if (req.files && req.files.length > 0) {
    body.photos = req.files.map((file) => {

      return `${req.protocol}://${req.get("host")}/uploads/products/${
        file.filename
      }`;
    });
  } else {
    delete body.photos;
  }


  try {
    console.log("==============================", body)

    const product = await Category.create(body);
    console.log("==============================")

    res.status(201).json({
      status: "success",
      message: "Product has been created successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.log(`Error...........`,error)
    if (error.errors) {
      const messages = Object?.values(error.errors)
        .map((item) => item.properties.message)
        .join(", ");

      return next(new AppError(`Validation failed, ${messages}.`, 400));
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern).join(" ");
      const capitalizeField =
        field.charAt(0).toUpperCase() + field.slice(1).toLocaleLowerCase();

      const message = `${capitalizeField} already exist, Please use another ${field}.`;
      return next(new AppError(message, 409));
    }

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = `uploads/products/${file.fileName}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            return next(new AppError(`Error removing file: ${filePath}`, 500));
          }
        });
      });
    }

    return next(
      new AppError(`Something went wrong while creating varient`, 400)
    );
  }
});

exports.getAllCategoryController = getAll(Category, {
  path: "subCategories",
  select: "slug isActive",
});

exports.getCategoryController = getOne(Category, {
  path: "subCategories",
  select: "title slug isActive",
});

exports.updateCategoryController = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  const category = await Category.findById(req.params.id);
  // console.log(".......... Category Controller",category)

  console.log(req.files,"Hello...............")



  if (!category) {
    return next(new AppError("No category was found with that ID!", 404));
  }



  // Update other fields
  Object.keys(req.body).forEach((key) => {
    category[key] = req.body[key];
  });
  if (req.files && req.files.length > 0) {
    body.photos = req.files.map((file) => {

      return `${req.protocol}://${req.get("host")}/uploads/products/${
        file.filename
      }`;
    });
  } else {
    delete body.photos;
  }
  console.log("Update Body",body)
  // res.json({data:{body}})
  try{
   const result= await Category.findByIdAndUpdate(req.params.id,body);
   console.log("Relutksfadjlkfasd",result)
  }catch(error){
    console.log(`Error...........`,error)
    // if (error.errors) {
    //   const messages = Object?.values(error.errors)
    //     .map((item) => item.properties.message)
    //     .join(", ");

    //   return next(new AppError(`Validation failed, ${messages}.`, 400));
    // } else if (error.code === 11000) {
    //   const field = Object.keys(error.keyPattern).join(" ");
    //   const capitalizeField =
    //     field.charAt(0).toUpperCase() + field.slice(1).toLocaleLowerCase();

    //   const message = `${capitalizeField} already exist, Please use another ${field}.`;
    //   return next(new AppError(message, 409));
    // }

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = `uploads/products/${file.fileName}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            return next(new AppError(`Error removing file: ${filePath}`, 500));
          }
        });
      });
    }

    return next(
      new AppError(`Something went wrong while update Category`, 400)
    );
  }


  res.status(200).json({
    status: "success",
    message: "Category has been updated successfully",
    data: {
      category,
    },
  });
});

exports.deleteCategoryController = catchAsync(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("No category was found with that ID!", 404));
  }

  // Find all sub-categories related to the category
  const subCategories = await SubCategory.find({ category: category._id });

  for (const subCategory of subCategories) {
    // Find all brands associated with this sub-category
    const brands = await Brand.find({ subCategory: subCategory._id });

    for (const brand of brands) {
      // Delete brand photo if it exists
      if (brand.photo) {
        const photoName = brand.photo.split("/").pop();
        const photoPath = path.join(
          __dirname,
          "..",
          "uploads",
          "brand",
          photoName
        );

        try {
          await fs.access(photoPath); // Check if the file exists
          await deleteFile(photoPath);
        } catch (err) {
          console.log(`Failed to delete brand photo: ${err.message}`);
        }
      }

      // Find all products associated with this brand
      const products = await Product.find({ brand: brand._id });

      for (const product of products) {
        // Delete product photos if they exist
        if (product.photos && product.photos.length > 0) {
          for (const photoPath of product.photos) {
            const photoName = photoPath.split("/").pop();
            const fullPath = path.join(
              __dirname,
              "..",
              "uploads",
              "products",
              photoName
            );

            try {
              await fs.access(fullPath); // Check if the file exists
              await deleteFile(fullPath);
            } catch (err) {
              console.log(`Failed to delete product photo: ${err.message}`);
            }
          }
        }

        // Find all variants associated with this product
        const variants = await Variant.find({ product: product._id });

        for (const variant of variants) {
          // Delete all options associated with this variant
          await Option.deleteMany({ variant: variant._id });

          // Delete the variant itself
          await Variant.findByIdAndDelete(variant._id);
        }

        // Delete the product itself
        await Product.findByIdAndDelete(product._id);
      }

      // Delete the brand itself
      await Brand.findByIdAndDelete(brand._id);
    }

    // Delete the sub-category itself
    await SubCategory.findByIdAndDelete(subCategory._id);
  }

  // Finally, delete the category itself
  await Category.findByIdAndDelete(category._id);

  res.status(204).json({
    status: "success",
    message:
      "Category has been deleted successfully along with all associated sub-categories, brands, products, variants, and options.",
    data: null,
  });
});

exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new AppError("No category found with that ID!", 404));
  }

  // Find products associated with the category
  const products = await Product.find({ category: categoryId })
    .populate([
      {
        path: "category subCategory brand",
        select: "title",
      },
      {
        path: "variants",
        select: "colorname colorCode details",
      },
    ])
    .select("-__v");

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getVariantsByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new AppError("No category found with that ID!", 404));
  }

  // Find variants associated with the category
  const variants = await Variant.find({ category: categoryId })
    .populate([
      {
        path: "category subCategory brand",
        select: "title",
      },
      {
        path: "product",
        select: "-category -subCategory -brand -variants -__v",
      },
      {
        path: "options",
        select: "-category -subCategory -brand -product -variant -__v",
      },
    ])
    .select("-__v");

  res.status(200).json({
    status: "success",
    results: variants.length,
    data: {
      variants,
    },
  });
});

exports.getOptionsByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new AppError("No category found with that ID!", 404));
  }

  // Find products associated with the category
  const query = Option.find({ category: categoryId })
    .populate([
      {
        path: "category subCategory brand",
        select: "title",
      },
      {
        path: "product",
        select: "-category -subCategory -brand -variants -__v",
      },
      {
        path: "variant",
        select: "colorName colorCode details",
      },
    ])
    .select("-__v");

  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const options = await features.query;

  res.status(200).json({
    status: "success",
    results: options.length,
    data: {
      options,
    },
  });
});
