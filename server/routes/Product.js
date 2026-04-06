import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, limit = 8, brand, search, sort,
      size, color, minPrice, maxPrice, rating, available, category,
      onSale // ✅ Added onSale to destructuring
    } = req.query;

    let query = {};

    // ✅ 1. SALE FILTER (Must be first to set the baseline)
    if (onSale === 'true') {
      query.isFlashSale = true;
    }

    // ✅ 2. ENHANCED SEARCH (Name + Brand)
    if (search) {
      const searchCriteria = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } }
        ]
      };

      // If we are already filtering by Sale, we combine them using $and
      if (query.isFlashSale) {
        query = { $and: [{ isFlashSale: true }, searchCriteria] };
      } else {
        query = searchCriteria;
      }
    }

    // 3. Helper to handle Arrays correctly
    const formatFilter = (param) => {
      if (!param) return null;
      return Array.isArray(param) ? param : param.split(',').filter(i => i !== '');
    };

    // 4. Brand Filter (Case-Insensitive)
    const brandFilter = formatFilter(brand);
    if (brandFilter && brandFilter.length > 0) {
      query.brand = { $in: brandFilter.map(b => new RegExp(`^${b}$`, 'i')) };
    }

    // 5. Category Filter (Case-Insensitive)
    if (category && category !== "") {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }

    // 6. Colors & Sizes
    const colorFilter = formatFilter(color);
    if (colorFilter && colorFilter.length > 0) query.colors = { $in: colorFilter };

    const sizeFilter = formatFilter(size);
    if (sizeFilter && sizeFilter.length > 0) {
      query.sizes = { $in: sizeFilter.map(String) };
    }

    // 7. Availability & Rating
    if (rating) query.rating = { $gte: Number(rating) };
    if (available === 'true') query.stockLeft = { $gt: 0 };

    // 8. Price Logic
    if (minPrice || maxPrice) {
      query.newPrice = {};
      if (minPrice) query.newPrice.$gte = Number(minPrice);
      if (maxPrice) query.newPrice.$lte = Number(maxPrice);
    }

    // 9. Sorting Logic
    let sortOptions = { createdAt: -1 }; 
    if (sort === 'price_asc') sortOptions = { newPrice: 1 };
    if (sort === 'price_desc') sortOptions = { newPrice: -1 };
    if (sort === 'popularity') sortOptions = { rating: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    // 10. Execution
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