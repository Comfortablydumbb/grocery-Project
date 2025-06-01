import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import dummyqr from '../assets/dummyqr.png';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("QR");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosPrivate.get("/v1/cart/getcart");
      
      // Validate cart items
      const items = res.data.cart?.cartItems || [];
      const validItems = items.filter(item => 
        item.productId && 
        item.quantity > 0 && 
        item.productId.remainingUnits >= item.quantity
      );

      if (items.length === 0) {
        setError("Your cart is empty");
        navigate("/cart");
        return;
      }

      if (items.length !== validItems.length) {
        const invalidItems = items.filter(item => 
          !item.productId || 
          item.quantity <= 0 || 
          item.productId.remainingUnits < item.quantity
        );

        const stockIssues = invalidItems
          .map(item => item.productId?.productName)
          .filter(Boolean)
          .join(", ");

        toast.error(`Some items have availability issues: ${stockIssues}`);
        navigate("/cart");
        return;
      }

      setCartItems(validItems);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load cart items");
      toast.error("Failed to load cart items");
      navigate("/cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateItemPrice = (item) => {
    if (!item?.productId) return 0;
    const basePrice = item.productId.price || 0;
    const discount = item.productId.discount || 0;
    return discount > 0 
      ? basePrice - (basePrice * discount / 100)
      : basePrice;
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price = calculateItemPrice(item);
        return total + price * (item.quantity || 0);
      }, 0)
      .toFixed(2);
  };

  const validateForm = () => {
    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return false;
    }
    if (!phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!/^[0-9]{10}$/.test(phoneNumber.trim())) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleOrderSubmit = async () => {
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    try {
      setProcessing(true);
      const selectedProducts = cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      const res = await axiosPrivate.post("/v1/cart/placeorder", {
        selectedProducts,
        address: address.trim(),
        phoneNumber: phoneNumber.trim(),
        paymentMethod,
      });

      toast.success(res.data.message);
      navigate("/orders");
    } catch (err) {
      console.error("Order failed:", err);
      const errorMessage = err.response?.data?.error || "Order failed. Please try again.";
      toast.error(errorMessage);
      
      // If there's a stock-related error, redirect to cart
      if (errorMessage.toLowerCase().includes("stock") || 
          errorMessage.toLowerCase().includes("available") ||
          errorMessage.toLowerCase().includes("insufficient")) {
        navigate("/cart");
      }
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 lg:pt-40 pb-12 px-4 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 lg:pt-40 pb-12 px-4 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            to="/cart"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-block"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  }

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
              {cartItems.map((item) => {
                if (!item.productId) return null;
                const product = item.productId;
                const finalPrice = calculateItemPrice(item);

                return (
                  <div
                    key={item._id}
                    className="flex justify-between py-2 border-b"
                  >
                    <div className="flex gap-4">
                      <img
                        src={`http://localhost:3001/public/${product.images?.[0] || 'default-product.jpg'}`}
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-product.jpg';
                        }}
                      />
                      <div>
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × Rs.{" "}
                          {finalPrice.toFixed(2)}
                          {product.discount > 0 && (
                            <span className="text-red-500 ml-1">
                              (-{product.discount}%)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          Available: {product.remainingUnits || 0} {product.unit || 'units'}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-green-600">
                      Rs. {(item.quantity * finalPrice).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>Rs. 100.00</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>Rs. {(parseFloat(calculateTotal()) + 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Payment Method*
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded-md p-2"
                disabled={processing}
              >
                <option value="QR">QR Payment</option>
                <option value="Cash">Cash on Delivery</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Delivery Address*
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-md p-2"
                rows={3}
                placeholder="Enter your complete delivery address"
                disabled={processing}
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number*
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border rounded-md p-2"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength={10}
                disabled={processing}
                required
              />
            </div>

            {/* Place Order */}
            <button
              onClick={handleOrderSubmit}
              disabled={processing || cartItems.length === 0}
              className={`w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 
                disabled:bg-gray-400 disabled:cursor-not-allowed ${processing ? "opacity-75" : ""}`}
            >
              {processing ? "Processing Order..." : `Pay Rs. ${(parseFloat(calculateTotal()) + 100).toFixed(2)}`}
            </button>
          </div>

          {/* Right Column - QR Section */}
          {paymentMethod === "QR" && (
            <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold text-center">QR Payment</h3>
              <div className="flex justify-center">
                <img
                  src={dummyqr}
                  alt="QR Code"
                  className="w-64 h-64 object-contain border"
                />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold">
                  Amount to Pay: Rs. {(parseFloat(calculateTotal()) + 100).toFixed(2)}
                </p>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">Instructions:</p>
                  <ol className="list-decimal list-inside text-left">
                    <li>Scan the QR code using any UPI app</li>
                    <li>Enter the exact amount shown above</li>
                    <li>Add your email in payment remarks</li>
                    <li>Complete the payment</li>
                  </ol>
                </div>
                <p className="text-sm text-gray-700 mt-4">
                  You can also WhatsApp us your payment screenshot for faster
                  confirmation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
