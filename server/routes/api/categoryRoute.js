const express = require("express");
const {
  createCategoryController,
  getAllCategoryController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getProductsByCategory,
  getVariantsByCategory,
  getOptionsByCategory,
} = require("../../controllers/categoryController");
const { uploadPhotoMiddleware, resizePhotoMiddleware } = require("../../middlewares/uploadPhotoMiddleware");

const router = express.Router();

router.route("/").post(    uploadPhotoMiddleware(true, 4),
resizePhotoMiddleware("products"),createCategoryController).get(getAllCategoryController);

router
  .route("/:id")
  .get(getCategoryController)
  .patch(uploadPhotoMiddleware(true, 4),
  resizePhotoMiddleware("products"),updateCategoryController)
  .delete(deleteCategoryController);

// Get all (Products, Variants, Options) of a Category:
router.get("/:categoryId/products", getProductsByCategory);
router.get("/:categoryId/variants", getVariantsByCategory);
router.get("/:categoryId/options", getOptionsByCategory);

module.exports = router;
