const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

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

exports.showOrders = async(req, res) => {
    try {
        var orders;
        if (req.query.from != null && req.query.to != null) {
            var from = new Date(req.query.from);
            var to = new Date(req.query.to);
            orders = await Order.find({ createAt: { "$gte": from, "$lte": to } }).sort({ createAt: -1 });
        } else {
            orders = await Order.find().sort({ createAt: -1 });
        }
        var orders2 = [];
        for (const order of orders) {
            var user = await User.findById(order.userId);
            var order2 = {}
            order2._id = order._id;
            order2.fullname = user.fullname;
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
        return res.render('order/list', { orders: orders2, user: req.session.user });
    } catch (error) {
        console.log(error);
        await req.flash('msg_error', 'Your orders cannot be displayed');
        return res.redirect("/home");
    }
}

exports.showOrder = async(req, res) => {
    try {
        var order = await Order.findById(req.params.orderId);
        var user = await User.findById(order.userId);
        var order2 = {}
        order2._id = order._id;
        order2.fullname = user.fullname;
        order2.email = user.email;
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
        return res.render('order/show', { order: order2, user: req.session.user });
    } catch (error) {
        console.log(error);
        await req.flash('msg_error', 'Your order cannot be displayed');
        return res.redirect("/home");
    }
}

exports.updateOrder = async(req, res) => {
    try {
        let id = req.body.id;
        let order = await Order.findById(id);
        order.address = req.body.address;
        order.status = req.body.status;
        order = await order.save();

        if (order.status == 3) {
            for (const item of order.items) {
                let product = await Product.findById(item.productId);
                product.quantity += item.quantity;
                await product.save();
            }
        }
        await req.flash('msg_success', 'Order has been updated successfully');
        return res.redirect('/admin/order/list');
    } catch (error) {
        console.log(error);
        await req.flash('msg_error', 'Failed! Order has not been updated');
        return res.redirect('/admin/order/list');
    }
}