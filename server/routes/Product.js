import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, limit = 8, brand, search, sort,
      size, color, minPrice, maxPrice, rating, available, category 
    } = req.query;

    let query = {};

    // 1. Text Search (Name)
    if (search) query.name = { $regex: search, $options: 'i' };

    // 2. Helper to handle Arrays correctly
    const formatFilter = (param) => {
      if (!param) return null;
      return Array.isArray(param) ? param : param.split(',').filter(i => i !== '');
    };

    // 3. Brand Filter (Made Case-Insensitive)
    const brandFilter = formatFilter(brand);
    if (brandFilter && brandFilter.length > 0) {
      // Use regex for each brand in the array to ignore capital letters
      query.brand = { $in: brandFilter.map(b => new RegExp(`^${b}$`, 'i')) };
    }

    // 4. Category Filter (Case-Insensitive)
    if (category && category !== "") {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }

    // 5. Colors & Sizes
    const colorFilter = formatFilter(color);
    if (colorFilter && colorFilter.length > 0) query.colors = { $in: colorFilter };

    const sizeFilter = formatFilter(size);
    if (sizeFilter && sizeFilter.length > 0) {
      query.sizes = { $in: sizeFilter.map(Number) };
    }

    // 6. Availability & Rating
    if (rating) query.rating = { $gte: Number(rating) };
    if (available === 'true') query.stockLeft = { $gt: 0 };

    // 7. Price Logic
    if (minPrice || maxPrice) {
      query.newPrice = {};
      if (minPrice) query.newPrice.$gte = Number(minPrice);
      if (maxPrice) query.newPrice.$lte = Number(maxPrice);
    }

    // 8. Sorting Logic
    let sortOptions = { createdAt: -1 }; 
    if (sort === 'price_asc') sortOptions = { newPrice: 1 };
    if (sort === 'price_desc') sortOptions = { newPrice: -1 };
    if (sort === 'popularity') sortOptions = { rating: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    // 9. Execution
    const skip = (Number(page) - 1) * Number(limit);
    
    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .lean() 
    ]);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        totalProducts,
        totalPages: Math.ceil(totalProducts / Number(limit)),
        currentPage: Number(page),
      }
    });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

export default router;