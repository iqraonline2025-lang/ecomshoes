// controllers/productController.js
const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { sort } = req.query;

    // Map frontend keys to MongoDB sort objects
    const sortMapping = {
      'popularity': { salesCount: -1 }, // Assuming a salesCount field
      'newest': { createdAt: -1 },
      'price_asc': { price: 1 },
      'price_desc': { price: -1 },
      'rating': { rating: -1 }
    };

    // Default to 'popularity' if no sort or invalid sort is provided
    const sortQuery = sortMapping[sort] || sortMapping['popularity'];

    // Execute query
    const products = await Product.find({})
      .sort(sortQuery)
      .collation({ locale: 'en', strength: 2 }); // Handles case-insensitive sorting if needed

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};