const { Router } = require("express");
const express = require("express");
const router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check, validateResult } = require("express-validator");

//Requests
router.post("/signin", [
    check("email").isEmail(),
    check("password").isLength({ min: 1 })
], signin);

router.post("/signup", [
    check("name", "name shouls be 3 char").isLength({ min: 3 }),
    check("email", "email format required").isEmail(),
    check("password").isLength({ min: 3 }).withMessage("Password should be min 3 char")
], signup);

router.get("/signout", signout);


//Just For Testing and debugging
router.post("/test", isSignedIn, (req, res) => {
    res.send("Congratulations you are on premium(Authenticated) route");
});

//



//export
module.exports = router;
