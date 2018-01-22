const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.getCategories = async (req, res) => {
    const categories = await Category.find();

    res.render('categories', { title: 'Categories', categories });
    // res.render(categories);
};

exports.addCategories = (req, res) => {
    res.render("addCategory", { title: "Add Category" });
}

exports.createCategories = async (req, res) => {
    // req.body.author = req.user._id;
    const category = await (new Category(req.body)).save();
    req.flash('success', `Successfully created ${category.category}.`);
    res.redirect(`/categories`);
}