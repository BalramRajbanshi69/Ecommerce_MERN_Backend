const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required:true
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Number,
      required: true,
    },
    productImage: { 
      type: [String], 
      required: true, 
    },
  },
  {
    timestamps: true,
  }
);

const ProductModal = mongoose.model("Product", productSchema); // Use PascalCase 'Product'
module.exports = ProductModal;