const Product = require('../models/product');

exports.showAllProducts = async(req, res) => {
    let products = await Product.find().sort({ createAt: -1 });
    return res.render('product/list', { products: products, user: req.session.user });
}

exports.searchProduct = async(req, res) => {
    let products = await Product.find({ name: { $regex: req.query.search, $options: "i" } }).sort({ createAt: -1 });
    return res.render('product/list', { products: products, search: req.query.search, user: req.session.user });
}

exports.addProduct = async(req, res) => {
    return res.render('product/add', { user: req.session.user });
}

exports.storeProduct = async(req, res) => {
    try {
        let newProduct;
        if (req.file) {
            newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,
                image: req.file.filename,
                description: req.body.description,
            });
        } else {
            newProduct = new Product({
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,
                description: req.body.description,
            });
        }
        await newProduct.save();
        await req.flash('msg_success', 'New product has been created successfully');
        return res.redirect('/admin/product/list');
    } catch (error) {
        console.log(error);
        await req.flash('msg_error', 'New product has not been created');
        return res.redirect('/admin/product/list');
    }
}

exports.editProduct = async(req, res) => {
    let id = req.query.id;
    let product = await Product.findById(id);
    return res.render('product/edit', { product: product, user: req.session.user });
}

exports.updateProduct = async(req, res) => {
    try {
        let id = req.body.id;
        let product = await Product.findById(id);
        product.name = req.body.name;
        product.price = req.body.price;
        product.quantity = req.body.quantity;
        if (req.file) {
            product.image = req.file.filename;
        }
        product.description = req.body.description;
        await product.save();
        await req.flash('msg_success', 'Product has been updated successfully');
        return res.redirect('/admin/product/list');
    } catch (error) {
        console.log(error);
        await req.flash('msg_error', 'Product has not been updated');
        return res.redirect('/admin/product/list');
    }
}

exports.deleteProduct = async(req, res) => {
    try {
        let id = req.query.id;
        await Product.findByIdAndRemove(id);
        await req.flash('msg_success', 'Product has been deleted successfully');
        return res.redirect('/admin/product/list');
    } catch (error) {
        console.log(error);
        await req.flash('msg_error', 'Product has not been deleted');
        return res.redirect('/admin/product/list');
    }
}