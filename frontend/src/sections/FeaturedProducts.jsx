"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../component/ProductCard";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { toast } from "react-hot-toast";

export default function FeaturedProducts() {
  const axiosPrivate = useAxiosPrivate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axiosPrivate.get("/v1/products");
      const allProducts = res.data.products || [];
      setFeaturedProducts(allProducts.slice(0, 4)); // Show only first 4
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const response = await axiosPrivate.post("/v1/cart/add", {
        productId,
        quantity: 1,
      });
      toast.success("Item added to cart");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error adding to cart:", err);
      const errorMessage = err.response?.data?.msg || "Failed to add to cart";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        >
          This Week's Favorites
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-600 text-base md:text-lg mb-12"
        >
          Hand-picked products you'll love
        </motion.p>

        {/* Product Grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          viewport={{ once: true }}
        >
          {loading ? (
            <p className="col-span-full text-gray-600">Loading...</p>
          ) : featuredProducts.length === 0 ? (
            <p className="col-span-full text-gray-600">
              No featured products found.
            </p>
          ) : (
            featuredProducts.map((product) => (
              <motion.div
                key={product._id}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 },
                }}
                whileHover={{ y: -5, scale: 1.03 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-2xl p-4 transition"
              >
                <ProductCard
                  id={product._id}
                  image={`http://localhost:3001/public/${product.images?.[0]}`}
                  name={product.productName}
                  category={product.category?.categoryName}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  discount={product.discount}
                  unit={product.unit}
                  onAddToCart={() => handleAddToCart(product._id)}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
