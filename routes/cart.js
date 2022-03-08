const express = require('express');
const cartController = require('../controllers/cart');

const router = express.Router();

router.get('/cart/add-to-cart/:id', cartController.addToCart);
router.get('/cart/increase/:id', cartController.increaseByOne);
router.get('/cart/decrease/:id', cartController.decreaseByOne);
router.get('/cart/remove/:id', cartController.removeItem);
router.get('/cart', cartController.showCart);
router.get('/update-cart', cartController.showCart);

module.exports = router;