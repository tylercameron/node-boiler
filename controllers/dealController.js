const mongoose = require('mongoose');
const Deal = mongoose.model('Deal');
const Store = mongoose.model('Store');

exports.getAllDeals = async (req, res) => {
    const deals = await Deal.find();
    // res.render(deals);
    res.render('deals', { title: 'Deals', deals });
};

exports.addDeal = (req, res) => {
    res.render('editDeal', { title: 'Add Deal' });
};

exports.createDeal = async (req, res) => {
    req.body.author = req.user._id;
    console.log(req);
    // req.body.store = req.params.id;
    // const store = await Store.findOne({ _id: req.params.id });
    // req.body.storeName = store.name;
    // const newDeal = new Deal(req.body);
    // await newDeal.save();
    // req.flash('success', 'Deal Saved!');
    // res.redirect('back');
    res.send(req);
};
 
    // exports.getStores = async (req, res) => {
    //     // console.log(req.name);
    //     const stores = await Store.find();
    //     res.render('stores', { title: 'Stores', stores });
    // };