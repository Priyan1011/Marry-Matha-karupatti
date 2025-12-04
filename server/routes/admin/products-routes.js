const express = require("express");
const multer = require("multer");
const {
  handleImageUpload,
  addProduct,
  editProduct,
  deleteProduct,
  fetchAllProducts,
} = require("../../controllers/admin/products-controller");

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Image upload endpoint
router.post("/upload-image", upload.single("my_file"), handleImageUpload);

// Product CRUD endpoints
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;
