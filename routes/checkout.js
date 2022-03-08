const express = require('express');
const checkoutController = require('../controllers/checkout');
const { isCustomer } = require('../middleware/auth');

const router = express.Router();

router.get('/checkout-form', isCustomer, checkoutController.getCheckout);
router.post('/checkout', isCustomer, checkoutController.checkout);

module.exports = router;