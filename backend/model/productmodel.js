// ProductModel.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    description: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    oldPrice: { type: Number },
    discount: { type: Number },
    images: [{ type: String, required: true }],
  },
  {
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
