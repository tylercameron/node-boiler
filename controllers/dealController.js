const mongoose = require('mongoose');
const Deal = mongoose.model('Deal');
const Store = mongoose.model('Store');
const User = mongoose.model('User');
const Category = mongoose.model('Category');
const slug = require('slugs');

async function makeSlug(store, description) {
    let dealSlug = slug(store.concat(" ", description));
    
    const slugRegExp = new RegExp(`^(${dealSlug})((-[0-9]*$)?)$`, "i");
    const dealsWithSlug = await Deal.find({ slug: slugRegExp });
    if (dealsWithSlug.length) {
        dealSlug = `${dealSlug}-${dealsWithSlug.length + 1}`;
    }
    return dealSlug;
};

exports.getAllDeals = async (req, res) => {
    const day = req.params.day;
    const dealQuery = day || { $exists: true };
    const dealsPromise = Deal.find({ 'day.daySlug': dealQuery });
    const dayPromise = Deal.getDays();
    const [ deals, days ] = await Promise.all([dealsPromise, dayPromise]);

    res.render('deals', { title: 'Deals', deals, days });
};

exports.getDeal = async (req, res) => {
    // TODO: see if there's a way to reduce second promise. maybe one call to get all deals on certain day then use filter method??
    const dealSlug = req.params.deal;
    const deal = await Deal.findOne({ slug: dealSlug });
    const day = deal.day.name;
    const deals = await Deal.find({ _id: { $ne: deal._id }, 'day.name': day });
    // res.send(deals);
    res.render('deal', { title: 'Deal', deal, deals });
};

exports.addDeal = async (req, res) => {
    const categories = await Category.find({});
    res.render('editDeal', { title: 'Add Deal', categories });
};

exports.createDeal = async (req, res) => {
    // Save user ID
    req.body.author = req.user._id;
    
    const storePromise = Store.findOne({ 
        'location.address': req.body.location.address,
        'name': req.body.name
    });
    const categoryPromise = Category.findOne({ 'category': req.body.category });
    const [ store, category ] = await Promise.all([ storePromise, categoryPromise ]);

    if (!category) {
        req.flash('error', 'You must select a valid category.');
        res.redirect('back');
    }
    req.body.category = category._id;
    
    // Check to see if store already exists
        // if yes -> add deal with restaurant ID
        // if no -> create Restaurant - Save It
    if (store) {
        // TODO Check to see if user has vendor status AND user ID == store.user ID
            // if yes -> set deal verified to TRUE
            // if no -> set deal verified to FALSE, set Store vendor to FALSE
        if (req.user.id === store.author.toString()) {
            req.body.verified = true;
        } else {
            req.body.verified = false;
        }
        req.body.store = store._id;
    } else {
        // TODO: add default image for store created this way
        const newStore = await (new Store(req.body)).save();
        req.body.store = newStore._id;
    }
    const slugs = await makeSlug(req.body.name, req.body.description);
    req.body.slug = slugs;
    req.body.day.order = req.body.day.name.slice(0, 1);
    req.body.day.name = req.body.day.name.slice(2, req.body.day.name.length);
    req.body.day.daySlug = req.body.day.name.toLowerCase();
 
    const newDeal = await (new Deal(req.body)).save();
    // res.send(req.body);
    req.flash('success', 'Deal Saved!');
    res.redirect('/deals');
};

exports.editDeal = async (req, res) => {
    // const id = req.params.id;
    // res.send(req.params.id);
    const categoriesPromise = Category.find({});
    const dealPromise = Deal.findOne({ _id: req.params.id });
    const [categories, deal] = await Promise.all([categoriesPromise, dealPromise]);
    // res.send(deal);
    res.render('editDeal', { title: 'Add Deal', deal, categories });
};

exports.updateDeal = (req, res) => {
    res.send(req.params.id);
//     req.body.location.type = 'Point';
//     // find and update store
//     // redirect to store and tell them it worked
//     const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
//         new: true, // return new store instead of old one
//         runValidators: true // force model to run validators
//     }).exec();    // mongodb method

//     req.flash('success', `Successfully update ${store.name}. <a href="/stores/${store.slug}">View Store</a>`);
//     res.redirect(`/stores/${store.id}/edit`);
};

exports.getDealsByCategory = async (req, res) => {
    let category = req.params.category;
    if (category) {
        const currentCategory = await Category.findOne({ slug: category });
        category = currentCategory._id
    }
    const categoryQuery = category || { $exists: true };

    const categoryPromise = Category.getCategoriesList();
    const dealsPromise = Deal.find({ category: categoryQuery });
    const [categories, deals] = await Promise.all([categoryPromise, dealsPromise]);
    
    res.render('categories', { categories, title: 'Categories', category, deals });
};