const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id).populate("category").exec((err, product) => {

        if (err) {
            return res.status(400).json({
                error: "Sorry Cant find the Product"
            });
        }
        req.product = product;
        next();
    });
};

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Product cant be created"
            });
        }
        //TODO restrictions on file


        let product = new Product(fields);
        //destructured fields
        const { name, description, price, category, stock } = fields;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Required Fields are missing"
            });
        }

        //handle a file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "file is too large to be accepted kindly keep it below 2MB"
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;

            //save to DB
            product.save((err, saveProduct) => {
                if (err) {
                    return res.status(400).json({
                        error: "Product can't be saved into DB"
                    });
                }
                return res.json(saveProduct);
            });

        }
    });
}


exports.getProduct = (req, res) => {
    //for sake of optimization part as binary data is huge at load time
    req.product.photo = undefined;
    return res.json(req.product);
};
//middleware for photo optimization
exports.getPhoto = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}


//update
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Product cant be created"
            });
        }
        //TODO restrictions on file

        //instead doing this we are having the new information coming from the  front end
        //let product = new Product(fields);
        let product = req.product;
        product = _.extend(product, fields);

        //handle a file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "file is too large to be accepted kindly keep it below 2MB"
                });
            }

            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;

            //save to DB
            product.save((err, saveProduct) => {
                if (err) {
                    return res.status(400).json({
                        error: "Product can't be saved into DB"
                    });
                }
                return res.json(saveProduct);
            });

        }
    });
}



exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

    Product.find()
        .select("_photo")
        .populate("category")
        .sort(sortBy)
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "Products can't be displayed"
                });
            }
            return res.json(products);
        });
};



//listing unique categories of products using distinct
exports.getAllUniqueProductsCategories = (req, res) => {
    Product.distinct("caategory", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "OOPS Cant find distinct categories"
            });
        }
        res.json(category);
    })
};





//middelware for stock and sold updation

exports.updateStock = (req, res) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }
            }
        }
    })
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return status(400).json({
                error: "Bulk Editing Failed updating of stocks & sold encounter some problem"
            });
        }
    });
};
