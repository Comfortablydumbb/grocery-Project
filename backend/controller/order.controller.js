const Order = require("../model/order.model");
const OrderItem = require("../model/orderitem.model");
const Product = require("../model/productmodel");
const Cart = require("../model/cart.model");
const CartItem = require("../model/cartitem.model");
const axios = require("axios");
const mongoose = require("mongoose");
const { generateAccessToken, PAYPAL_API } = require("../utils/paypal");

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch the order with populated orderItems
    const order = await Order.findById(orderId).populate({
      path: 'orderItems',
      populate: {
        path: 'productId',
        select: 'productName remainingUnits soldUnits'
      }
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Ensure the order can only be cancelled if it's pending
    if (order.status !== "Pending") {
      return res.status(400).json({ 
        error: "Order can only be cancelled if it's pending" 
      });
    }

    // Update product quantities
    for (const item of order.orderItems) {
      if (!item.productId) continue;

      await Product.findByIdAndUpdate(
        item.productId._id,
        {
          $inc: {
            remainingUnits: item.quantity,  // Add back to remaining units
            soldUnits: -item.quantity       // Subtract from sold units
          }
        }
      );
    }

    // Update order status to "Cancelled"
    order.status = "Cancelled";
    await order.save();

    return res.status(200).json({ 
      message: "Order cancelled successfully",
      order 
    });

  } catch (error) {
    console.error("Order Cancellation Error:", error);
    return res.status(500).json({ 
      error: "Failed to cancel order",
      details: error.message 
    });
  }
};

// Get All Orders for Logged-in User

exports.getOrders = async (req, res) => {
  try {
    console.log("🔵 Incoming request for orders...");

    if (!req.user || !req.user._id) {
      console.log("❌ Unauthorized: No valid user");
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Ensure userId is a valid ObjectId
    const userId = new mongoose.Types.ObjectId(req.user._id);
    console.log("🟢 Fetching orders for user:", userId);

    // Try fetching orders with proper population
    const orders = await Order.find({ userId: userId })
      .populate({
        path: "orderItems",
        populate: { 
          path: "productId", 
          select: "productName price images"
        }
      })
      .sort({ createdAt: -1 });

    // Return empty array instead of 404 when no orders found
    console.log("✅ Orders retrieved:", orders.length);
    return res.status(200).json({ 
      success: true, 
      orders: orders || [] 
    });

  } catch (error) {
    console.error("❌ Get Orders Error:", error);
    return res.status(500).json({
      error: "Failed to retrieve orders",
      details: error.message
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    console.log("📌 Fetching all orders...");

    const orders = await Order.find()
      .populate({
        path: "userId",
        select: "name email", // Fetch user details
      })
      .populate({
        path: "orderItems",
        populate: {
          path: "productId",
          select: "_id productName price images ", // Fetch product details
        },
      })
      .sort({ createdAt: -1 }); // Sort orders by latest

    return res
      .status(200)
      .json({ message: "✅ Orders fetched successfully", orders });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.changeOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Allowed status updates
    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status update" });
    }

    // Fetch the order
    const order = await Order.findById(orderId)
      .populate({
        path: "userId",
        select: "name email", // Fetch user details
      })
      .populate({
        path: "orderItems",
        populate: {
          path: "productId",
          select: "_id productName price images ", // Fetch product details
        },
      });
    if (!order) return res.status(404).json({ error: "Order not found" });

    // Prevent changing status of cancelled orders
    if (order.status === "Cancelled") {
      return res.status(400).json({ error: "Cannot update a cancelled order" });
    }

    // Update the order status
    order.status = status;
    await order.save();

    return res
      .status(200)
      .json({ message: `✅ Order status updated to ${status}`, order });
  } catch (error) {
    console.error("❌ Order Status Update Error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong, please try again" });
  }
};
