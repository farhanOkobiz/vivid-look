const path = require("path");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const Brand = require("../models/brandModel");
const Product = require("../models/productModel");
const Option = require("../models/optionModel");
const Variant = require("../models/variantModel");
const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const deleteFile = require("../utils/deleteFile");
const { getAll, getOne, updateOne } = require("../utils/handleFactory");

exports.createSubCategoryController = catchAsync(async (req, res, next) => {
  // let subCategory;
  // try{

  //    subCategory = await SubCategory.create(req.body);

  // }catch(error){
  //   console.log("Error..........",error)

  // }
  // // console.log(subCategory,"SubCategory....... Controller")


  // const category = await Category.findOneAndUpdate(
  //   { _id: subCategory.category },
  //   { $push: { subCategories: subCategory._id } },
  //   { new: true }
  // );


  // if (!category)
  //   return next(new AppError("No category found with that ID!", 404));

  // res.status(201).json({
  //   status: "success",
  //   data: {
  //     subCategory,
  //   },
  // });
  console.log(req.body,"Request Body......          3                  33333333333.")
  const body = { ...req.body };

  if (req.files && req.files.length > 0) {
    body.photos = req.files.map((file) => {

      return `${req.protocol}://${req.get("host")}/uploads/subCategory/${
        file.filename
      }`;
    });
  } else {
    delete body.photos;
  }


  try {
    console.log("==============================", body)

    const subCategory = await SubCategory.create(body);
     const category = await Category.findOneAndUpdate(
    { _id: subCategory.category },
    { $push: { subCategories: subCategory._id } },
    { new: true }
  );
    res.status(201).json({
      status: "success",
      message: "Sub-Category has been created successfully",
      data: {
        subCategory,
      },
    });
  } catch (error) {
    // console.log(`Error...........`,error)
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
        const filePath = `uploads/subCategory/${file.fileName}`;
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

exports.getAllSubCategoryController = getAll(SubCategory, {
  path: "brands",
  select: "photo slug isActive",
});

exports.getSubCategoryController = getOne(SubCategory, [
  {
    path: "category",
    select: "slug",
  },
  {
    path: "brands",
    select: "photo slug isActive",
  },
]);

// exports.updateSubCategoryController = updateOne(SubCategory);

exports.updateSubCategoryController = catchAsync(async (req, res, next) => {
  const subCategory = await SubCategory.findById(req.params.id);
  console.log("THis is subCategory" , subCategory)
  if (!subCategory) {
    return next(new AppError("No subCategory was found with that ID!", 404));
  }

  const body = req.body;

  // Handle photo uploads if present
  if (req.files && req.files.length > 0) {
    // Remove old photos from file system
    if (subCategory.photos && subCategory.photos.length > 0) {
      for (const photoPath of subCategory.photos) {
        const photoName = photoPath.split("/").pop();
        const path = `uploads/subCategory/${photoName}`;
        try {
          await deleteFile(path);
        } catch (err) {
          console.error(`Failed to delete file: ${err.message}`);
        }
      }
    }

    // Update photos
    body.photos = req.files.map(
      (file) =>
        `${req.protocol}://${req.get("host")}/uploads/subCategory/${file.filename}`
    );
  }

  Object.keys(body).forEach((key) => {
    subCategory[key] = body[key];
  });
  await subCategory.save();

  res.status(200).json({
    status: "success",
    message: "subCategory has been updated successfully",
    data: {
      subCategory,
    },
  });
});

exports.deleteSubCategoryController = catchAsync(async (req, res, next) => {
  // Find the sub-category by ID
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory) {
    return next(new AppError("No Sub-Category was found with that ID!", 404));
  }

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
        await deleteFile(photoPath);
      } catch (err) {
        console.log(`Failed to delete brand photo: ${err.message}`);
        // Continue with the deletion process even if the photo deletion fails
      }
    }

    // Find all products associated with this brand
    const products = await Product.find({ brand: brand._id });

    for (const product of products) {
      // Delete product photos if they exist
      if (product.photos && product.photos.length > 0) {
        for (const photoPath of product.photos) {
          const photoName = photoPath.split("/").pop();
          const productPhotoPath = path.join(
            __dirname,
            "..",
            "uploads",
            "products",
            photoName
          );

          try {
            await deleteFile(productPhotoPath);
          } catch (err) {
            console.log(`Failed to delete product photo: ${err.message}`);
            // Continue with the deletion process even if the photo deletion fails
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

  // Remove the sub-category from all categories that include it
  await Category.updateMany(
    { subCategories: subCategory._id },
    { $pull: { subCategories: subCategory._id } }
  );

  // Finally, delete the sub-category itself
  await SubCategory.findByIdAndDelete(subCategory._id);

  res.status(204).json({
    status: "success",
    message:
      "Sub-Category has been deleted successfully along with all associated brands, products, variants, and options",
    data: null,
  });
});

// Get all (Products, Variants, Options) of a Sub-Category:
exports.getProductsBySubCategory = catchAsync(async (req, res, next) => {
  const { subCategoryId } = req.params;

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) {
    return next(new AppError("No sub-category found with that ID!", 404));
  }

  // Find products associated with the category
  const products = await Product.find({ subCategory: subCategoryId }).select(
    "-__v"
  );

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getVariantsBySubCategory = catchAsync(async (req, res, next) => {
  const { subCategoryId } = req.params;

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) {
    return next(new AppError("No sub-category found with that ID!", 404));
  }

  // Find variants associated with the category
  const variants = await Variant.find({ subCategory: subCategoryId }).select(
    "-__v"
  );

  res.status(200).json({
    status: "success",
    results: variants.length,
    data: {
      variants,
    },
  });
});

exports.getOptionsBySubCategory = catchAsync(async (req, res, next) => {
  const { subCategoryId } = req.params;

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory) {
    return next(new AppError("No sub-category found with that ID!", 404));
  }

  // Find products associated with the category
  const query = Option.find({ subCategory: subCategoryId })
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
