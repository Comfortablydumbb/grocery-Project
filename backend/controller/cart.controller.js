require("dotenv").config();
const Cart = require("../model/cart.model");
const CartItem = require("../model/cartitem.model");
const Product = require("../model/productmodel");
const Order = require("../model/order.model");
const OrderItem = require("../model/orderitem.model");
const mongoose = require("mongoose");
const axios = require("axios");
const { generateAccessToken, PAYPAL_API } = require("../utils/paypal");

// ✅ Extract User ID
const extractUserId = (req) => {
  if (!req.user || !req.user._id)
    throw new Error("User ID not found in request");
  return req.user._id;
};

// ✅ Add to Cart (No Quantity)
exports.addToCart = async (req, res) => {
  try {
    const userId = extractUserId(req);
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, cartItems: [] });
      await cart.save();
    }

    const existingCartItem = await CartItem.findOne({
      cartId: cart._id,
      productId,
    });
    if (!existingCartItem) {
      const cartItem = new CartItem({
        cartId: cart._id,
        productId,
        quantity: 1,
      });
      await cartItem.save();
      cart.cartItems.push(cartItem._id);
      await cart.save();
    }

    res.status(201).json({ msg: "Product added to cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// ✅ Update Cart Item Quantity
exports.updateCartQuantity = async (req, res) => {
  try {
    const userId = extractUserId(req);
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const cartItem = await CartItem.findOne({
      cartId: cart._id,
      productId,
    });

    if (!cartItem) {
      return res.status(404).json({ msg: "Cart item not found" });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ msg: "Cart updated successfully", cartItem });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// ✅ Remove Product from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = extractUserId(req);
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    // Find and delete the cart item
    const cartItem = await CartItem.findOneAndDelete({
      cartId: cart._id,
      productId,
    });

    if (!cartItem) {
      return res.status(404).json({ msg: "Item not found in cart" });
    }

    // Remove the reference from the cart
    cart.cartItems.pull(cartItem._id);
    await cart.save();

    res.status(200).json({ msg: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// ✅ Get Cart with Items
exports.getCart = async (req, res) => {
  try {
    const userId = extractUserId(req);
    const cart = await Cart.findOne({ userId }).populate({
      path: "cartItems",
      populate: {
        path: "productId",
        select: "productName price images totalQuantity",
      },
    });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(200).json({ cart: { cartItems: [] } });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.placeOrderFromCart = async (req, res) => {
  try {
    console.log("🛒 Placing order from cart...");

    const userId = req.user._id;
    const { selectedProducts, address, phoneNumber, paymentMethod } = req.body;

    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      return res.status(400).json({ error: "No products selected for order" });
    }

    const cart = await Cart.findOne({ userId }).populate("cartItems");

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let orderItems = [];
    let totalAmount = 0;

    for (let item of selectedProducts) {
      const { productId, quantity } = item;
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product with ID ${productId} not found` });
      }

      const orderItem = new OrderItem({
        orderId: null,
        productId,
        quantity,
        price: product.price,
        totalPrice: quantity * product.price,
      });

      await orderItem.save();
      orderItems.push(orderItem._id);
      totalAmount += orderItem.totalPrice;
    }

    const order = new Order({
      userId,
      orderItems,
      totalAmount,
      address,
      phoneNumber,
      paymentMethod: paymentMethod,
      status: paymentMethod === "cash" ? "Processing" : "Pending",
      paymentStatus: paymentMethod === "cash" ? "Pending" : "Paid",
    });

    await order.save();

    await OrderItem.updateMany(
      { _id: { $in: orderItems } },
      { orderId: order._id }
    );

    const orderedProductIds = selectedProducts.map((p) => p.productId);
    await CartItem.deleteMany({
      cartId: cart._id,
      productId: { $in: orderedProductIds },
    });

    // Response based on payment method
    if (paymentMethod === "cash") {
      return res.json({
        message: "Order placed successfully. Pay in cash upon delivery.",
        orderId: order._id,
        totalAmount,
      });
    } else {
      return res.json({
        message: "Order placed successfully. Awaiting QR payment confirmation.",
        orderId: order._id,
        totalAmount,
        instructions: `Please scan the QR code and send the payment of NPR ${totalAmount.toFixed(
          2
        )}. Add your email in the remarks for confirmation.`,
      });
    }
  } catch (error) {
    console.error("❌ Order Placement Error:", error);
    return res
      .status(500)
      .json({ error: "Order placement failed, please try again" });
  }
};
