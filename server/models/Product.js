import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, index: true },
  
  // 🆕 Fixed Category: Uses 'enum' to prevent typos (case-sensitive)
  category: { 
    type: String, 
    required: true,
    enum: ['Footwear', 'Apparel', 'Accessories', 'Sale'], 
    default: 'Footwear',
    index: true 
  }, 

  oldPrice: { type: Number, default: 0 },
  newPrice: { type: Number, required: true, index: true },
  
  // 🆕 Added onSale boolean: This makes the "Sales" page logic very easy
  onSale: { type: Boolean, default: false, index: true },
  
  images: [{ type: String, required: true }], 
  sizes: [{ type: String }], // Changed to String to support sizes like "US 10" or "XL"
  colors: [{ type: String }], 
  rating: { type: Number, default: 0, index: true },
  stockLeft: { type: Number, default: 0 },
  totalStock: { type: Number, default: 0 },
  isFlashSale: { type: Boolean, default: false }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;