const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,

    // ✅ UPDATED: Packing sizes with individual pricing and stock
    packingSizes: [
      {
        size: String,           // "250g", "500g", "1kg"
        price: Number,          // base price for this size
        salePrice: Number,      // ✅ NEW: sale price (optional, for discounts)
        stock: Number,          // individual stock for this packing
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
