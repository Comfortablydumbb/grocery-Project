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
    totalUnits: { type: Number, required: true, min: 0 },
    remainingUnits: { type: Number, required: true, min: 0 },
    soldUnits: { type: Number, default: 0, min: 0 }
  },
  {
    timestamps: true,
    autoIndex: true,
    autoCreate: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
