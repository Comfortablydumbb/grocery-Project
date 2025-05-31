import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const GET_CATEGORIES_URL = "/v1/categories";
const GET_PRODUCT_URL = "/v1/product";
const UPDATE_PRODUCT_URL = "/v1/product"; // Will append ID

const UpdateProduct = () => {
  const [productName, setProductName] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosPrivate.get(GET_CATEGORIES_URL);
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };

    const fetchProduct = async () => {
      try {
        const res = await axiosPrivate.get(`${GET_PRODUCT_URL}/${id}`);

        const data = res.data.product;

        console.log(res.data.product);
        setProductName(data.productName);
        setUnit(data.unit);
        setDescription(data.description);
        setCategory(data.category);
        setPrice(data.oldPrice);
        setDiscount(data.discount);
        setExistingImages(data.images || []);
      } catch (err) {
        toast.error("Failed to load product");
      }
    };

    fetchCategories();
    fetchProduct();
  }, [id, axiosPrivate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !category || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("unit", unit);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("discount", discount);
    images.forEach((file) => formData.append("images", file));

    try {
      setIsLoading(true);
      await axiosPrivate.put(`${UPDATE_PRODUCT_URL}/${id}`, formData);
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Update Product
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit *
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none text-sm"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Existing Images
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:3001/public/${img}`}
                  alt={`existing-${i}`}
                  className="w-16 h-16 object-cover rounded border"
                />
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload New Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
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
            {isLoading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UpdateProduct;
