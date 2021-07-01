const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');



exports.signin = (req, res) => {
    //const user = new User(req.body);
    //console.log(user);
    const { email, password } = req.body;
    const errors = validationResult(req);
    //console.log(req.body);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    User.findOne({ email }, (err, usr) => {
        // console.log(usr);

        if (err || !usr) {

            return res.status(400).json({
                error: "UserEmail dosen't exist"
            });
        }

        if (!usr.authenticate(password)) {
            return res.status(410).json({
                error: "email and password doesn't match"
            });
        }

        //create token
        const token = jwt.sign({ _id: usr._id }, process.env.SECRET);
        //put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });
        //send it to Front end
        const { _id, name, role } = usr;
        return res.json({
            token,
            usr: {
                _id,
                name,
                email,
                role
            }
        });

    })


};

// exports.signup = (req, res) => {
//     console.log("REQ BODY", req.body);
//     res.json({
//         message: "signup is running"
//     });
// };

exports.signup = (req, res) => {

    const user = new User(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "NOT able to save user in DB"
            });
        }
        //res.json(user);
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    })

    console.log("REQ_BODY", req.body);
};


exports.signout = (req, res) => {
    //clearing the json web token from the cookie to revoke authorization
    res.clearCookie("token");
    res.json({ key: "User Signout" })
};


//Protected Routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})


//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "You are not ADMIN : ACCESS DENIED"
        });
    }
    next();
};