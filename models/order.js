const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
});


const OrderSchema = new mongoose.Schema({
    products: [ProductCartSchema],
    trasactionid: {},
    amount: {
        type: Number
    },
    address: String,
    updated: Date,
    user: {
        type: ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const Order = mongoose.model("Order", OrderSchema);
const ProductCart = mongoose.model("ProductCart", ProductCartSchema);
//mongoose.export = mongoose.model("Product", productSchema);
module.exports = { Order, ProductCart };