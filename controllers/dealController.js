const mongoose = require('mongoose');
const Deal = mongoose.model('Deal');

exports.addDeal = async (req, res) => {
    req.body.author = req.user._id;
    req.body.store = req.params.id;
    const newDeal = new Deal(req.body);
    await newDeal.save();
    req.flash('success', 'Deal Saved!');
    res.redirect('back');
};

exports.getAllDeals = async (req, res) => {
    const deals = await Deal.find();
    res.render(deals);
}
 
    // exports.getStores = async (req, res) => {
    //     // console.log(req.name);
    //     const stores = await Store.find();
    //     res.render('stores', { title: 'Stores', stores });
    // };