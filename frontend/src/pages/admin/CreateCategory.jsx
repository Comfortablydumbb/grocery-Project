import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CREATE_CATEGORY_URL = "/v1/category";

const CreateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  useEffect(() => {
    // Clean up preview URLs on unmount
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName || images.length === 0) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", categoryName);
    images.forEach((file) => formData.append("images", file));

    try {
      setIsLoading(true);
      await axiosPrivate.post(CREATE_CATEGORY_URL, formData);

      toast.success("Category created successfully!");
      setImages([]);
      setImagePreviews([]);
      setCategoryName("");
      navigate("/admin/categories");
    } catch (err) {
      toast.error("Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create New Category
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Vegetables"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              required
              className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm mb-2"
            />
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {imagePreviews.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`preview-${i}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCategory;
