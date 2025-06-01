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

    // Get product to check remaining units
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, cartItems: [] });
      await cart.save();
    }

    const existingCartItem = await CartItem.findOne({
      cartId: cart._id,
      productId,
    });

    // Calculate new quantity
    const newQuantity = existingCartItem ? existingCartItem.quantity + 1 : 1;

    // Check if adding would exceed available stock
    if (newQuantity > product.remainingUnits) {
      return res.status(400).json({ 
        msg: `Cannot add more items. Only ${product.remainingUnits} units available in stock.`,
        availableStock: product.remainingUnits,
        currentCartQuantity: existingCartItem ? existingCartItem.quantity : 0
      });
    }

    if (!existingCartItem) {
      const cartItem = new CartItem({
        cartId: cart._id,
        productId,
        quantity: 1,
      });
      await cartItem.save();
      cart.cartItems.push(cartItem._id);
      await cart.save();
    } else {
      existingCartItem.quantity = newQuantity;
      await existingCartItem.save();
    }

    res.status(201).json({ 
      msg: "Product added to cart", 
      cart,
      availableStock: product.remainingUnits,
      currentCartQuantity: newQuantity
    });
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
        select: "productName price images remainingUnits unit discount oldPrice"
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

    // Validate required fields
    if (!address || !phoneNumber || !paymentMethod) {
      return res.status(400).json({ 
        error: "Missing required fields: address, phoneNumber, or paymentMethod" 
      });
    }

    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      return res.status(400).json({ error: "No products selected for order" });
    }

    const cart = await Cart.findOne({ userId }).populate("cartItems");

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    let orderItems = [];
    let totalAmount = 0;

    // Validate products and check stock
    for (let item of selectedProducts) {
      const { productId, quantity } = item;
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(400).json({ 
          error: `Product with ID ${productId} not found` 
        });
      }

      // Check if enough stock is available
      if (product.remainingUnits < quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for product ${product.productName}. Available: ${product.remainingUnits}`
        });
      }

      const orderItem = await OrderItem.create({
        orderId: null,
        productId,
        quantity,
        price: product.price,
        totalPrice: quantity * product.price,
      });

      // Update product inventory
      await Product.findByIdAndUpdate(productId, {
        $inc: {
          remainingUnits: -quantity,
          soldUnits: quantity
        }
      });

      orderItems.push(orderItem._id);
      totalAmount += orderItem.totalPrice;
    }

    // Validate payment method
    if (!["Cash", "QR"].includes(paymentMethod)) {
      return res.status(400).json({ 
        error: "Invalid payment method. Must be 'Cash' or 'QR'" 
      });
    }

    // Create order
    const order = await Order.create({
      userId,
      orderItems,
      totalAmount,
      address,
      phoneNumber,
      paymentMethod: paymentMethod,
      status: "Pending",
      paymentStatus: paymentMethod === "Cash" ? "Pending" : "Paid",
    });

    // Update orderItems with the order ID
    await OrderItem.updateMany(
      { _id: { $in: orderItems } },
      { orderId: order._id }
    );

    // Remove ordered items from cart
    const orderedProductIds = selectedProducts.map((p) => p.productId);
    await CartItem.deleteMany({
      cartId: cart._id,
      productId: { $in: orderedProductIds }
    });

    // Prepare response based on payment method
    const response = {
      message: paymentMethod === "Cash" 
        ? "Order placed successfully. Pay in cash upon delivery."
        : "Order placed successfully. Awaiting QR payment confirmation.",
      orderId: order._id,
      totalAmount
    };

    // Add QR specific instructions if needed
    if (paymentMethod === "QR") {
      response.instructions = `Please scan the QR code and send the payment of NPR ${totalAmount.toFixed(2)}. Add your email in the remarks for confirmation.`;
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error("❌ Order Placement Error:", error);
    return res.status(500).json({ 
      error: "Order placement failed, please try again",
      details: error.message 
    });
  }
};
