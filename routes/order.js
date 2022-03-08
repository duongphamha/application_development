const express = require('express');
const orderController = require('../controllers/order');
const { isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/admin/order/list', isAdmin, orderController.showOrders);
router.get('/admin/order/show/:orderId', isAdmin, orderController.showOrder);
router.post('/admin/order/update', isAdmin, orderController.updateOrder);

module.exports = router;