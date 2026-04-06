import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Product from '../models/Product.js';

const router = express.Router();

// 1. Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// 2. Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shoe_store_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

// 3. Multer Middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 } 
}).array('files', 10);

// Helper to handle Array inputs from FormData
const parseArrayInput = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    return input.split(',').map(item => item.trim()).filter(item => item !== "");
  }
};

// --- CREATE PRODUCT ---
router.post('/upload', (req, res) => {
  console.log("📥 Incoming Upload Request...");

  upload(req, res, async (err) => {
    if (err) {
      console.error("❌ Multer/Cloudinary Error:", err.message);
      return res.status(500).json({ success: false, error: err.message });
    }

    try {
      const imageUrls = req.files ? req.files.map(file => file.path) : [];
      const newPrice = Number(req.body.newPrice) || 0;

      // ✅ FIX: Mapping category to match your Model Enum ('Footwear', 'Apparel', etc.)
      // Since your frontend sends "sneakers", we default it to "Footwear"
      let categoryValue = "Footwear"; 
      const receivedCategory = req.body.category?.trim();
      
      if (['Footwear', 'Apparel', 'Accessories', 'Sale'].includes(receivedCategory)) {
        categoryValue = receivedCategory;
      }

      const productData = {
        name: req.body.name,
        brand: req.body.brand,
        images: imageUrls,
        newPrice,
        oldPrice: Number(req.body.oldPrice) || newPrice + 20,
        // ✅ FIX: Model expects strings for sizes now
        sizes: parseArrayInput(req.body.sizes).map(String), 
        colors: parseArrayInput(req.body.colors),
        isFlashSale: req.body.isFlashSale === 'true' || req.body.isFlashSale === true,
        onSale: req.body.isFlashSale === 'true' || req.body.onSale === 'true',
        category: categoryValue, 
        stockLeft: Number(req.body.stockLeft) || 10,
        totalStock: Number(req.body.totalStock) || 50
      };

      const product = await Product.create(productData);
      console.log("✅ Product Created Successfully:", product._id);
      res.status(201).json({ success: true, data: product });

    } catch (error) {
      console.error("❌ Database Error:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// --- UPDATE PRODUCT ---
router.put('/:id', (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    try {
      const existingProduct = await Product.findById(req.params.id);
      if (!existingProduct) return res.status(404).json({ success: false, error: "Product not found" });

      let imageUrls = existingProduct.images;
      if (req.files && req.files.length > 0) {
        imageUrls = req.files.map(file => file.path);
      }

      const updateData = {
        name: req.body.name || existingProduct.name,
        brand: req.body.brand || existingProduct.brand,
        images: imageUrls,
        newPrice: req.body.newPrice ? Number(req.body.newPrice) : existingProduct.newPrice,
        oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : existingProduct.oldPrice,
        sizes: req.body.sizes ? parseArrayInput(req.body.sizes).map(String) : existingProduct.sizes,
        colors: req.body.colors ? parseArrayInput(req.body.colors) : existingProduct.colors,
        isFlashSale: req.body.isFlashSale !== undefined ? (req.body.isFlashSale === 'true' || req.body.isFlashSale === true) : existingProduct.isFlashSale,
        category: req.body.category || existingProduct.category,
        stockLeft: req.body.stockLeft ? Number(req.body.stockLeft) : existingProduct.stockLeft
      };

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// --- DELETE PRODUCT ---
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });
    
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;