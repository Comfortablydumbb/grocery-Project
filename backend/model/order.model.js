const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderDate: { type: Date, default: Date.now },
    orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderItem" }],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "QR"], // ✅ Removed "PayPal"
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    currency: { type: String, default: "NPR" }, // Still useful
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
