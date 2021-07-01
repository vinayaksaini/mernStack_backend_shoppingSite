const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { getProductById, updateStock } = require("../controllers/product");
const { getOrderById, createOrder, getAllOrders } = require("../controllers/order");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//getRoutes

//create
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, createOrder)

//read
router.get("/order/all.:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders);

module.exports = router;