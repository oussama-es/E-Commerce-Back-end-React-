const express = require('express');
const {
  userById,
  addProductsToUserHistory,
} = require('../middlewares/user');
const {
  create,
  listOrders,
  getStatus,
  updateOrderStatus,
} = require('../controllers/orderController');
const { requireSignIN, isAuth, isAdmin } = require('../middlewares/auth');
const { decreaseQuantity } = require('../middlewares/product');
const { orderById } = require('../middlewares/order');

const router = express.Router();

// Définition des paramètres userId et orderId
router.param('userId', userById);
router.param('orderId', orderById);

// Définition des routes
router.post(
  '/create/:userId',
  [requireSignIN, isAuth, addProductsToUserHistory, decreaseQuantity],
  create
);
router.get('/:userId', [requireSignIN, isAuth, isAdmin], listOrders);
router.get('/status/:userId', [requireSignIN, isAuth, isAdmin], getStatus); // Placez cette route avant la suivante
router.patch('/:orderId/status/:userId', [requireSignIN, isAuth, isAdmin], updateOrderStatus);

module.exports = router;
