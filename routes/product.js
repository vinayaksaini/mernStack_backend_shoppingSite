const express = require("express");
const router = express.Router();


const { getProductById, createProduct, getProduct, getPhoto, updateProduct } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//all params
router.param("userId", getUserById);
router.param("productId", getProductById);

//all routes
///create
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);
//read
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", getPhoto);
//delete


//update
router.put("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);


///listen



module.exports = router;