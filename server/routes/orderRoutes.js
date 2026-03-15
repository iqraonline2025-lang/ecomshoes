import express from 'express';
import { 
  getOrderTracking, 
  getMyOrders, 
  createOrder 
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js'; 

const router = express.Router();

/**
 * @route   POST /external-api/checkout
 * @desc    Create a new order and process checkout
 * @access  Private
 * Note: Because this is mounted at /external-api in server.js, 
 * the path here should just be '/checkout'
 */
router.post('/checkout', protect, createOrder);

/**
 * @route   GET /api/orders/myorders
 * @desc    Get all orders for the currently logged-in user
 * @access  Private
 */
router.get('/myorders', protect, getMyOrders);

/**
 * @route   GET /api/orders/track/:orderId
 * @desc    Track a specific order (Public/Guest access)
 * @access  Public
 */
router.get('/track/:orderId', getOrderTracking);

export default router;