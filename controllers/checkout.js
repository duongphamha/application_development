const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.getCheckout = (req, res) => {
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    const cart = new Cart(req.session.cart);
    return res.render('store/checkout', { products: cart.generateArray(), totalPrice: cart.totalPrice, user: req.session.user });
};

exports.checkout = async(req, res) => {
    if (!req.session.cart) {
        return res.redirect('/cart');
    }
    const cart = new Cart(req.session.cart);
    const arrCart = Object.keys(cart.items).map((key) => cart.items[key]);
    const cart2 = arrCart.map((elem) => {
        return {
            productId: mongoose.Types.ObjectId(elem.item._id),
            quantity: elem.qty,
            price: elem.price,
        }
    });
    for (const el of arrCart) {
        let product = await Product.findById(el.item._id);
        product.quantity -= el.qty;
        await product.save();
    }
    const userId = req.session.user._id;
    try {
        const order = new Order({
            userId: userId,
            items: cart2,
            totalPrice: cart.totalPrice,
            phone: req.body.phone,
            address: req.body.address,
        });
        await order.save();
        await req.flash('msg_success', 'Your order has been received');
        return res.redirect('/home');
    } catch (error) {
        console.log(error);
        await req.flash('msg_error', 'Failed! Your order has not been received');
        return res.redirect('/home');
    }
};