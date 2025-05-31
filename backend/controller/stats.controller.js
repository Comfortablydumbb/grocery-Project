const User = require("../model/usermodel");
const Product = require("../model/productmodel");
const Category = require("../model/category.model");
const Order = require("../model/order.model"); // Import your Order model
const Cart = require("../model/cart.model");

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Sum of totalAmount from all orders
    const totalEarningsResult = await Order.aggregate([
      { $group: { _id: null, totalEarnings: { $sum: "$totalAmount" } } },
    ]);
    const totalEarnings =
      totalEarningsResult.length > 0 ? totalEarningsResult[0].totalEarnings : 0;

    // Order statuses
    const statuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    const orderStatusCounts = await Promise.all(
      statuses.map(async (status) => {
        const count = await Order.countDocuments({ status });
        return { status, count };
      })
    );

    const stats = [
      {
        label: "Total Users",
        value: totalUsers,
        color: "bg-green-100",
        textColor: "text-green-700",
      },
      {
        label: "Total Products",
        value: totalProducts,
        color: "bg-blue-100",
        textColor: "text-blue-700",
      },
      {
        label: "Total Categories",
        value: totalCategories,
        color: "bg-yellow-100",
        textColor: "text-yellow-700",
      },
      {
        label: "Total Orders",
        value: totalOrders,
        color: "bg-purple-100",
        textColor: "text-purple-700",
      },
      {
        label: "Total Earnings (NPR)",
        value: totalEarnings.toFixed(2),
        color: "bg-teal-100",
        textColor: "text-teal-700",
      },
      ...orderStatusCounts.map((s) => ({
        label: `${s.status} Orders`,
        value: s.count,
        color: getStatusColor(s.status).bg,
        textColor: getStatusColor(s.status).text,
      })),
    ];

    res.status(200).json({ stats });
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// Helper to map status to Tailwind colors
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return { bg: "bg-orange-100", text: "text-orange-700" };
    case "Processing":
      return { bg: "bg-indigo-100", text: "text-indigo-700" };
    case "Shipped":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "Delivered":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "Cancelled":
      return { bg: "bg-red-100", text: "text-red-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700" };
  }
};

exports.getCustomerStats = async (req, res) => {
  try {
    const userId = req.user._id; // assuming you use auth middleware and user is attached to req

    // Total orders by the user
    const totalOrders = await Order.countDocuments({ userId });

    // Pending orders
    const pendingOrders = await Order.countDocuments({
      userId,
      status: "Pending",
    });

    // Total spend (only from paid orders)
    const totalSpendResult = await Order.aggregate([
      {
        $match: {
          userId,
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalSpend: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalSpend =
      totalSpendResult.length > 0 ? totalSpendResult[0].totalSpend : 0;

    // Total cart items
    const userCart = await Cart.findOne({ userId });
    const cartItems = userCart ? userCart.cartItems.length : 0;

    const stats = {
      totalOrders,
      pendingOrders,
      totalSpend: totalSpend.toFixed(2),
      cartItems,
    };

    res.status(200).json({ stats });
  } catch (err) {
    console.error("❌ Error fetching customer stats:", err);
    res.status(500).json({ error: "Failed to fetch customer stats" });
  }
};
