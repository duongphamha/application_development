const express = require('express');
const storeController = require('../controllers/store');
const { isCustomer } = require('../middleware/auth');

const router = express.Router();

router.get('/home', storeController.home);
router.get('/search', storeController.search);
router.get('/purchase-history', isCustomer, storeController.purchaseHistory);
router.get('/order/cancel/:orderId', isCustomer, storeController.cancelOrder);

module.exports = router;