const express = require("express");
const router = express.Router();

const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getCategoryById, getAllCategory, getCategory, updateCategory, deleteCategory, createCategory } = require("../controllers/category");


router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//get
router.get("/categories", getAllCategory);
router.get("/category/:categoryId", getCategory);

//create
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);

//update
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory);


//delete
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteCategory);


module.exports = router;