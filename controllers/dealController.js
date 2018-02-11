const mongoose = require('mongoose');
const Deal = mongoose.model('Deal');
const Store = mongoose.model('Store');
const User = mongoose.model('User');

exports.getAllDeals = async (req, res) => {
    const deals = await Deal.find();
    // res.render(deals);
    res.render('deals', { title: 'Deals', deals });
};

exports.addDeal = (req, res) => {
    res.render('editDeal', { title: 'Add Deal' });
};

exports.createDeal = async (req, res) => {
    // req.body.author = req.user._id;
    // console.log(req);
    // req.body.store = req.params.id;
    // const store = await Store.findOne({ _id: req.params.id });
    // req.body.storeName = store.name;
    // const newDeal = new Deal(req.body);
    // await newDeal.save();
    // req.flash('success', 'Deal Saved!');
    // res.redirect('back');
    // res.send(req);

    // Save user ID
    req.body.author = req.user._id;

    
    // const tagPromise = Store.getTagsList();
    // const storesPromise = Store.find({ tags: tagQuery });
    // const [tags, stores] = await Promise.all([tagPromise, storesPromise]);
    
    // const userPromise = User.find({ _id: req.user.id });
    const store = await Store.findOne({ 'location.address': req.body.location.address });
    // const [user, store] = await Promise.all([ userPromise, storePromise ]);
    
    // Check to see if store already exists
    if (store) {
        // TODO Check to see if user has vendor status AND user ID == store.user ID
        if (req.user.id === store.author.toString()) {
            // if yes -> set deal verified to TRUE
            req.body.verified = true;
        } else {
            // if no -> set deal verified to FALSE, set Store vendor to FALSE
            req.body.verified = false;
        }
        console.log('store exists');
        req.body.store = store._id;
        // req.body.author = req.user._id;
    } else {
        console.log('no store in db');
        // TODO: add default image for store created this way
        const newStore = await (new Store(req.body)).save();
    }
        // if yes -> add deal with restaurant ID
        // if no -> create Restaurant - Save It
    // Select existing Category
        // if doesnt exist -> create new Category
    console.log(req.body, req.user, store);
    res.send(req.body);
};
 
    // exports.getStores = async (req, res) => {
    //     // console.log(req.name);
    //     const stores = await Store.find();
    //     res.render('stores', { title: 'Stores', stores });
    // };