const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

// ✅ NEW: Helper function to calculate variant stats
const calculateVariantStats = (packingSizes) => {
  if (!packingSizes || packingSizes.length === 0) {
    return {
      computedPrice: 0,
      computedSalePrice: 0,
      computedTotalStock: 0,
    };
  }

  // Calculate total stock: sum of all packing stocks
  const computedTotalStock = packingSizes.reduce(
    (sum, packing) => sum + (parseInt(packing.stock) || 0),
    0
  );

  // Calculate lowest base price
  const basePrices = packingSizes
    .map((p) => parseInt(p.price))
    .filter((p) => !isNaN(p) && p > 0);
  const computedPrice =
    basePrices.length > 0 ? Math.min(...basePrices) : 0;

  // Calculate lowest sale price (or use base if no sale price exists)
  const salePrices = packingSizes
    .map((p) => {
      const salePrice = parseInt(p.salePrice);
      return !isNaN(salePrice) && salePrice > 0 ? salePrice : null;
    })
    .filter((p) => p !== null);

  const computedSalePrice =
    salePrices.length > 0 ? Math.min(...salePrices) : 0;

  return {
    computedPrice,
    computedSalePrice,
    computedTotalStock,
  };
};

// Add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      packingSizes, // ✅ receive packing sizes
    } = req.body;

    console.log(averageReview, "averageReview");

    // ✅ NEW: Calculate prices and stock from variants
    const variantStats = calculateVariantStats(packingSizes);

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      // ✅ NEW: Use computed values from variants if available
      price: packingSizes && packingSizes.length > 0 ? variantStats.computedPrice : price,
      salePrice: packingSizes && packingSizes.length > 0 ? variantStats.computedSalePrice : salePrice,
      totalStock: packingSizes && packingSizes.length > 0 ? variantStats.computedTotalStock : totalStock,
      averageReview,
      packingSizes: packingSizes || [], // save packing sizes
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      packingSizes, // ✅ receive updated packing sizes
    } = req.body;

    let findProduct = await Product.findById(id);

    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    // ✅ NEW: Calculate prices and stock from variants
    const variantStats = calculateVariantStats(packingSizes);

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    
    // ✅ NEW: Use computed values from variants if available
    if (packingSizes && packingSizes.length > 0) {
      findProduct.price = variantStats.computedPrice;
      findProduct.salePrice = variantStats.computedSalePrice;
      findProduct.totalStock = variantStats.computedTotalStock;
    } else {
      findProduct.price = price === "" ? 0 : price || findProduct.price;
      findProduct.salePrice =
        salePrice === "" ? 0 : salePrice || findProduct.salePrice;
      findProduct.totalStock = totalStock || findProduct.totalStock;
    }

    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;
    findProduct.packingSizes = packingSizes || findProduct.packingSizes; // update packing sizes

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
