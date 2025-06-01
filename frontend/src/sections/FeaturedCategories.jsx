"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import bannerimage from "../assets/grocery.jpg";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../context/SearchProvider";

const banners = [
  {
    id: 1,
    title: "Everyday Fresh & Clean with Our Products",
    image: bannerimage,
    bg: "bg-green-50",
  },
  {
    id: 2,
    title: "Make your Breakfast Healthy and Easy",
    image: bannerimage,
    bg: "bg-red-50",
  },
  {
    id: 3,
    title: "The best Organic Products Online",
    image: bannerimage,
    bg: "bg-blue-50",
  },
];

export default function FeaturedCategories() {
  const axiosPrivate = useAxiosPrivate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setSelectedCategories, setSearchQuery, setSearchResults } = useSearch();

  const fetchCategories = async () => {
    try {
      const res = await axiosPrivate.get("/v1/categories");
      const data = res.data || [];
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    // Reset any existing search
    setSearchQuery('');
    setSearchResults([]);
    // Set the selected category
    setSelectedCategories([category.categoryName]);
    // Navigate to shop page
    navigate('/shop');
  };

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center md:text-left"
      >
        Featured Categories
      </motion.h2>

      {/* Categories Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {loading ? (
          <p className="col-span-full text-gray-600 text-center">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="col-span-full text-gray-600 text-center">
            No categories available.
          </p>
        ) : (
          categories.map((cat) => (
            <motion.div
              key={cat._id}
              onClick={() => handleCategoryClick(cat)}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              whileHover={{ y: -5, scale: 1.03 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`rounded-xl border bg-green-50 p-4 text-center cursor-pointer hover:shadow-xl transition`}
            >
              <img
                src={`http://localhost:3001/public/${cat.images[0]}`}
                alt={cat.categoryName}
                className="h-16 w-16 mx-auto object-contain mb-3"
              />
              <h4 className="font-semibold text-gray-800">
                {cat.categoryName}
              </h4>
              <p className="text-gray-500 text-sm">
                {cat.productCount || 0} items
              </p>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Promo Banners */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {banners.map((banner) => (
          <motion.div
            key={banner.id}
            variants={{
              hidden: { opacity: 0.5, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className={`rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between ${banner.bg} shadow-md hover:shadow-lg transition`}
          >
            {/* Text */}
            <div className="mb-4 md:mb-0 md:w-1/2">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {banner.title}
              </h3>
              <button 
                onClick={() => {
                  setSelectedCategories([]);
                  setSearchQuery('');
                  setSearchResults([]);
                  navigate("/shop");
                }} 
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-5 py-2 rounded-full transition"
              >
                Shop Now →
              </button>
            </div>

            {/* Image */}
            <motion.img
              src={banner.image}
              alt={banner.title}
              className="h-28 md:h-36 object-contain md:w-auto rounded-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
