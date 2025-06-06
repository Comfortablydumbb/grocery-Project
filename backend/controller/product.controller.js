const Product = require("../model/productmodel");
const Category = require("../model/category.model");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      category,
      price,
      images,
      discount,
      unit,
      totalUnits
    } = req.body;

    // Validate total units
    if (!totalUnits || totalUnits < 0) {
      return res.status(400).json({ message: "Total units must be a positive number" });
    }

    // Check if category exists
    const foundCategory = await Category.findById(category);
    if (!foundCategory) {
      return res.status(400).json({ message: "Invalid category" });
    }

    let imagePaths = req.files
      ? req.files.map((file) => file.filename)
      : undefined;

    let finalPrice = price;
    let oldPrice = undefined;

    if (discount) {
      oldPrice = price;
      finalPrice = price - (price * discount) / 100;
    }

    const newProduct = new Product({
      productName,
      description,
      category: foundCategory._id,
      price: finalPrice,
      oldPrice: oldPrice,
      unit,
      totalUnits,
      remainingUnits: totalUnits, // Initially, remaining units equals total units
      soldUnits: 0, // Initially, no units are sold
      images,
      discount: discount || 0,
    });

    if (imagePaths) {
      newProduct.images = imagePaths;
    }
    await newProduct.save();
    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    return res.status(200).json({ products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving product", error: error.message });
  }
};

// Update a product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      productName, 
      description, 
      category, 
      price, 
      discount, 
      unit,
      totalUnits 
    } = req.body;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate total units against sold units
    if (totalUnits !== undefined && totalUnits < existingProduct.soldUnits) {
      return res.status(400).json({ 
        message: "Total units cannot be less than sold units" 
      });
    }

    let imagePaths;

    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => file.filename);
    } else {
      imagePaths = existingProduct.images; // Preserve existing images
    }

    // Handle discount logic
    let finalPrice = price;
    let oldPrice = undefined;

    if (discount) {
      oldPrice = price;
      finalPrice = price - (price * discount) / 100;
    }

    // Calculate new remaining units if total units is updated
    let newRemainingUnits = existingProduct.remainingUnits;
    if (totalUnits !== undefined) {
      const unitsDifference = totalUnits - existingProduct.totalUnits;
      newRemainingUnits = existingProduct.remainingUnits + unitsDifference;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        description,
        category,
        unit,
        price: finalPrice,
        discount: discount || 0,
        oldPrice: oldPrice,
        totalUnits: totalUnits || existingProduct.totalUnits,
        remainingUnits: newRemainingUnits,
        images: imagePaths, // Always set this explicitly
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(200).json({ products: [] });
    }

    // Create a case-insensitive regex pattern
    const searchPattern = new RegExp(query, 'i');

    // Search in product name and description
    const products = await Product.find({
      $or: [
        { productName: searchPattern },
        { description: searchPattern }
      ]
    }).populate('category');

    res.status(200).json({ products });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: "Error searching products", 
      error: error.message 
    });
  }
};
