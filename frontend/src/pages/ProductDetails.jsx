import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ChevronLeft } from "lucide-react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosPrivate.get(`/v1/product/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, axiosPrivate]);

  const handleAddToCart = async () => {
    try {
      await axiosPrivate.post("/v1/cart/add", {
        productId: id,
        quantity: quantity,
      });
      toast.success("Added to cart successfully");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 mb-4">Product not found</p>
        <button
          onClick={() => navigate("/shop")}
          className="text-green-600 hover:text-green-700 flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-green-600 hover:text-green-700 flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={`http://localhost:3001/public/${product.images[selectedImage]}`}
                alt={product.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer ${
                    selectedImage === index
                      ? "ring-2 ring-green-500"
                      : "ring-1 ring-gray-200"
                  }`}
                >
                  <img
                    src={`http://localhost:3001/public/${image}`}
                    alt={`${product.productName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.productName}
              </h1>
              <p className="text-lg text-gray-500 mt-2">
                Category: {product.category?.categoryName}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-2xl font-bold text-green-600">
                Rs. {product.price}
                {product.discount > 0 && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    Rs. {product.oldPrice}
                  </span>
                )}
              </p>
              {product.discount > 0 && (
                <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>

            {product.unit && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Unit</h3>
                <p className="mt-2 text-gray-600">Price per {product.unit}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;