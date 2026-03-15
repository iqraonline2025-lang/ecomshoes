import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shoe_store_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage }).array('files', 10);

const parseArrayInput = (input) => {
  if (!input) return [];
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    return input.split(',').map(item => item.trim()).filter(item => item !== "");
  }
};

// --- CREATE ---
router.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    try {
      const imageUrls = req.files ? req.files.map(file => file.path) : [];
      const newPrice = Number(req.body.newPrice) || 0;

      const productData = {
        ...req.body,
        images: imageUrls,
        newPrice,
        oldPrice: Number(req.body.oldPrice) || newPrice + 20,
        sizes: parseArrayInput(req.body.sizes).map(Number),
        colors: parseArrayInput(req.body.colors),
        isFlashSale: req.body.isFlashSale === 'true',
        category: req.body.category?.toLowerCase() || "sneakers"
      };

      const product = await Product.create(productData);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

// --- DELETE ---
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: "Product not found" });

    // Optional: Delete images from Cloudinary here if needed
    
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- UPDATE (Edit) ---
router.put('/:id', (req, res) => {
  // Use upload in case the admin wants to change images during the edit
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    try {
      const existingProduct = await Product.findById(req.params.id);
      if (!existingProduct) return res.status(404).json({ success: false, error: "Product not found" });

      // If new files are uploaded, use them; otherwise, keep old images
      let imageUrls = existingProduct.images;
      if (req.files && req.files.length > 0) {
        imageUrls = req.files.map(file => file.path);
      }

      const updateData = {
        name: req.body.name || existingProduct.name,
        brand: req.body.brand || existingProduct.brand,
        category: req.body.category?.toLowerCase() || existingProduct.category,
        images: imageUrls,
        newPrice: Number(req.body.newPrice) || existingProduct.newPrice,
        oldPrice: Number(req.body.oldPrice) || existingProduct.oldPrice,
        sizes: req.body.sizes ? parseArrayInput(req.body.sizes).map(Number) : existingProduct.sizes,
        colors: req.body.colors ? parseArrayInput(req.body.colors) : existingProduct.colors,
        isFlashSale: req.body.isFlashSale !== undefined ? req.body.isFlashSale === 'true' : existingProduct.isFlashSale,
        stockLeft: Number(req.body.stockLeft) || existingProduct.stockLeft
      };

      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
});

export default router;