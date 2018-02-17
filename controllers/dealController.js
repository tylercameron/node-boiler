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
    const dealsPromise = Deal.find();
    const dayPromise = Deal.getDays();
    const [ deals, days ] = await Promise.all([dealsPromise, dayPromise]);
    // res.render(deals);
    res.render('deals', { title: 'Deals', deals, days });
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
 
    const newDeal = await (new Deal(req.body)).save();
    
    req.flash('success', 'Deal Saved!');
    res.redirect('/deals');
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