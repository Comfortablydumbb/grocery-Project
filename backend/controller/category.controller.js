const Category = require("../model/category.model");

// CREATE Category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const imagePaths = req.files ? req.files.map((file) => file.filename) : [];

    const newCategory = new Category({
      categoryName,
      images: imagePaths,
    });

    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
};

// GET ALL Categories
exports.getAllCategories = async (req, res) => {
  try {
    // Aggregate categories and count the number of products for each category
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products", // Assuming your products collection is named "products"
          localField: "_id", // Field in the Category model
          foreignField: "category", // Field in the Product model (reference to category)
          as: "products", // The name of the new array containing matched products
        },
      },
      {
        $project: {
          categoryName: 1, // Keep the categoryName field
          images: 1, // Keep the images field
          productCount: { $size: "$products" }, // Add productCount as the size of the "products" array
        },
      },
    ]);

    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
};

// GET Category BY ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching category", error: error.message });
  }
};

// UPDATE Category
exports.updateCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    const imagePaths = req.files ? req.files.map((file) => file.filename) : [];

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        categoryName,
        ...(imagePaths.length && { images: imagePaths }),
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({ message: "Category updated", category: updatedCategory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
};

// DELETE Category
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting category", error: error.message });
  }
};
