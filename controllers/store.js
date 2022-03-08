const Order = require('../models/order');
const Product = require('../models/product');

exports.home = async(req, res) => {
    const products = await Product.find().sort({ createAt: -1 });
    const orders = await Order.find();
    var max_count = 0;

    var products2 = products;
    for (const product of products2) {
        var cnt = 0;
        for (const order of orders) {
            order.items.forEach((item) => {
                if (product._id.equals(item.productId)) {
                    cnt += item.quantity;
                }
            });
        }
        if (cnt > max_count) {
            max_count = cnt;
        }
        product.counter = cnt;
    }

    for (const product of products2) {
        if (product.counter == max_count) {
            product.isHot = true;
        } else {
            product.isHot = false;
        }
    }

    return res.render('store/home', { products: products2, user: req.session.user });
};

exports.search = async(req, res) => {
    try {
        const name = req.query.name;
        const gte = req.query.gte;
        const lte = req.query.lte;
        var products = [];
        if (name && gte && lte) {
            products = await Product.find({ name: { $regex: name, $options: "i" } }).where('price').gte(gte).lte(lte).sort("-createdAt");
        } else if (name) {
            products = await Product.find({ name: { $regex: name, $options: "i" } }).sort("-createdAt");
        } else if (gte && lte) {
            products = await Product.where('price').gte(gte).lte(lte).sort("-createdAt");
        }
        res.render("store/home", { products, name: req.query.name, gte: req.query.gte, lte: req.query.lte, user: req.session.user });
    } catch (error) {
        console.log(error);
        return res.redirect("/home");
    }
}

exports.purchaseHistory = async(req, res) => {
    try {
        var orders = await Order.find().where({ userId: req.session.user._id }).sort({ createAt: -1 });;
        var orders2 = [];
        for (const order of orders) {
            var order2 = {}
            order2._id = order._id;
            order2.status = getStatus(order.status);
            order2.totalPrice = order.totalPrice;
            order2.phone = order.phone;
            order2.address = order.address;
            order2.createAt = order.createAt.toLocaleString();
            order2.items = []
            for (const item of order.items) {
                var item2 = {};
                await Product.findById(item.productId).then(ii => {
                    item2.product = { name: ii.name }
                    item2.quantity = item.quantity;
                    item2.price = item.price;
                });
                order2.items.push(item2);
            }
            orders2.push(order2);
        }
        res.render('store/purchase-history', { orders: orders2, user: req.session.user });
    } catch (error) {
        console.log(error);
        return res.redirect("/home");
    }
}

exports.cancelOrder = async(req, res) => {
    try {
        const orderId = req.params.orderId;
        let order = await Order.findById(orderId);
        order.status = 4;
        await order.save();
        await req.flash('msg_success', 'The order has been requested to be cancelled. Please wait for order cancellation confirmation.');
        return res.redirect('/purchase-history');
    } catch (error) {
        console.log(error);
        await req.flash('msg_error', 'The order has not been requested to be cancelled');
        return res.redirect('/home');
    }
}

function getStatus(status) {
    if (status == 0) {
        return "Received";
    } else if (status == 1) {
        return "In progress"
    } else if (status == 2) {
        return "Completed"
    } else if (status == 3) {
        return "Cancelled"
    } else if (status == 4) {
        return "Waiting to cancel order"
    } else {
        return "";
    }
}