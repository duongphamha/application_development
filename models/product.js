const mongoose = require('../db/db');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: 'product.png',
    },
    description: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now
    },
});

module.exports = mongoose.model('Product', productSchema);