import connectDB from '@/lib/mongodb'; // Ensure you have a DB connection utility
import Product from '@/models/Product';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { sort, brand, maxPrice } = req.query;

        // 1. Build Filter Object
        let query = {};
        if (brand) query.brand = { $in: brand.split(',') };
        if (maxPrice) query.newPrice = { $lte: Number(maxPrice) };

        // 2. Build Sort Logic
        const sortMapping = {
          'popularity': { salesCount: -1 },
          'newest': { createdAt: -1 },
          'price_asc': { newPrice: 1 },
          'price_desc': { newPrice: -1 },
          'rating': { rating: -1 }
        };
        const sortOrder = sortMapping[sort] || sortMapping['popularity'];

        const products = await Product.find(query).sort(sortOrder);
        return res.status(200).json(products);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'POST':
      try {
        // Create new product with the array of images from the request body
        const product = await Product.create(req.body);
        return res.status(201).json({ success: true, data: product });
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}