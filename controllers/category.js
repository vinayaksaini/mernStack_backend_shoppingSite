const Category = require("../models/category");

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, newCategory) => {
        if (err) {
            return res.status(400).json({
                error: "Cant create this category in DB"
            });
        }
        res.json({ newCategory });
    });
};

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cate) => {
        if (err) {
            return res.status(400).json({
                error: "Category not present in DB"
            });
        }
        req.category = cate;
        next();
    });
};

exports.getAllCategory = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "No Category found in DB"
            });
        }
        return res.json(categories);
    });
};

exports.getCategory = (req, res) => {
    return res.json(req.category);
};


exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if (err) {
            return res.status(400).json({
                error: "Ctaegory not found in DB"
            });
        }
        return res.json(updatedCategory);
    });
};


exports.deleteCategory = (req, res) => {


    const category = req.category;
    if (!category)
        return res.status(400).json({
            error: "NO category exists"
        });
    category.remove((err, removedCategory) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete the category"
            });
        }
        return res.json({
            message: "Successfully deleted",
            value: removedCategory
        });
    });
}