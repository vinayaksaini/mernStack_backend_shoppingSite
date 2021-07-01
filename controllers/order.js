const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name price")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "No Order Found in DB"
                });
            }
            req.order = order;
        });
};

exports.createOrder = (req, res) => {
    //updating user info
    req.body.order.user = req.profile;
    //creating Order obj for db save
    const order = new Order(req.body.order);
    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                error: "Order can't be created in DB"
            });
        }
        return res.json(order);
    });
};


exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "_id name")
        .exec((err, orders) => {
            if (err) {
                res.status(400).json({
                    error: "Cant fetch orders from db"
                });
            }
            return res.json(order);
        });
};


exports.getOrderstatus = (req, res) => {
    return res.json(Order.schema.path("status").enumValues)
};

exports.updatestatus = (req, res) => {
    Order.update(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "Order Status cant be updated"
                });
            }
            return res.json(order);
        }
    )
};