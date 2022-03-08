const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addToCart = (req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/cart');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        return res.redirect('/cart');
    });
};

exports.increaseByOne = async(req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.increaseByOne(productId);
    req.session.cart = cart;
    return res.redirect('/cart');
};

exports.decreaseByOne = async(req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.decreaseByOne(productId);
    req.session.cart = cart;
    return res.redirect('/cart');
};

exports.removeItem = async(req, res) => {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart = cart;
    return res.redirect('/cart');
};

exports.showCart = async(req, res) => {
    if (!req.session.cart) {
        return res.render('store/cart', { products: null, user: req.session.user });
    }
    const cart = new Cart(req.session.cart);
    return res.render('store/cart', { products: cart.generateArray(), totalPrice: cart.totalPrice, user: req.session.user });
};