const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 0 },
        price: { type: Number, default: 0 },
    }],
    totalPrice: { type: Number, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: Number, required: true, default: 0 },
    createAt: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model('Order', schema);