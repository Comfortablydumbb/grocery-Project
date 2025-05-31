import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import dummyqr from '../assets/dummyqr.png';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("QR");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await axiosPrivate.get("/v1/cart/getcart");
      setCartItems(res.data.cart.cartItems || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.productId.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleOrderSubmit = async () => {
    const selectedProducts = cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));

    try {
      const res = await axiosPrivate.post("/v1/cart/placeorder", {
        selectedProducts,
        address,
        phoneNumber,
        paymentMethod,
      });

      toast.success(res.data.message);
      navigate("/orders");
    } catch (err) {
      console.error("Order failed:", err.response?.data || err.message);
      toast.error("Order failed. Please try again.");
    }
  };

  return (
    <div className="py-20 lg:pt-40 pb-12 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Column - Form & Summary */}
          <div className="space-y-6">
            {/* Cart Summary */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between py-2 border-b"
                >
                  <div>
                    <p className="font-medium">{item.productId.productName}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × Rs.{" "}
                      {item.productId.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-green-600">
                    Rs. {(item.quantity * item.productId.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>Rs. {calculateTotal()}</span>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="QR">QR Payment</option>
                <option value="Cash">Cash on Delivery</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-md p-2"
                rows={3}
                placeholder="Your delivery address"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border rounded-md p-2"
                placeholder="e.g. 9800000000"
              />
            </div>

            {/* Place Order */}
            <button
              onClick={handleOrderSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Place Order
            </button>
          </div>

          {/* Right Column - QR Section */}
          {paymentMethod === "QR" && (
            <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-center">QR Payment</h3>
              <div className="flex justify-center">
                {/* Replace with your actual QR image path */}
                <img
                  src={dummyqr}
                  alt="QR Code"
                  className="w-64 h-64 object-contain border"
                />
              </div>
              <p className="text-sm text-gray-700 text-center">
                <strong>Note:</strong> While paying, please include your email
                in the remarks.
              </p>
              <p className="text-sm text-gray-700 text-center">
                You can also WhatsApp us your payment screenshot for faster
                confirmation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
