const express = require("express");
const {
  createSubCategoryController,
  getAllSubCategoryController,
  getSubCategoryController,
  updateSubCategoryController,
  deleteSubCategoryController,
  getProductsBySubCategory,
  getVariantsBySubCategory,
  getOptionsBySubCategory,
} = require("../../controllers/subCategoryController");
const { uploadPhotoMiddleware, resizePhotoMiddleware } = require("../../middlewares/uploadPhotoMiddleware");

const router = express.Router();

router
  .route("/")
  .post(
    uploadPhotoMiddleware(true, 4),
    resizePhotoMiddleware("subCategory"),
    createSubCategoryController
  )
  .get(getAllSubCategoryController);

router
  .route("/:id")
  .get(getSubCategoryController)
  .patch(
    uploadPhotoMiddleware(true, 4),
    resizePhotoMiddleware("subCategory"),
    updateSubCategoryController
  )
  .delete(deleteSubCategoryController);

// Get all (Products, Variants, Options) of a Sub-Category:
router.get("/:subCategoryId/products", getProductsBySubCategory);
router.get("/:subCategoryId/variants", getVariantsBySubCategory);
router.get("/:subCategoryId/options", getOptionsBySubCategory);

module.exports = router;
