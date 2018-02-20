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
    res.render('addDeal', { title: 'Add Deal', categories });
};

function confirmOwner(id, store) {
    if (id.toString() === store.author.toString()) {
        return true;
    } else {
        return false;
    }
}

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
            // if no -> set deal verified to FALSE
        req.body.verified = confirmOwner(req.user.id, store);
        req.body.store = store._id;
    } else {
        // TODO: add default image for store created this way
        const newStore = await (new Store(req.body)).save();
        req.body.store = newStore._id;
    };
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
    const categoriesPromise = Category.find({});
    const dealPromise = Deal.findOne({ _id: req.params.id });
    const [categories, deal] = await Promise.all([categoriesPromise, dealPromise]);
    if (req.user._id.toString() === deal.author.toString()) {
        res.render('editDeal', { title: 'Add Deal', deal, categories });
    } else {
        req.flash('error', `You must be the author of this deal to make any changes`);
        res.redirect(`/deals`);
    }
};

exports.updateDeal = async (req, res) => {
    req.body.author = req.user._id;
    const storePromise = Store.findOne({ _id: req.body.store });
    const categoryPromise = Category.findOne({ 'category': req.body.category });
    const [ store, category ] = await Promise.all([ storePromise, categoryPromise ]);

    req.body.verified = confirmOwner(req.user._id, store);
    req.body.category = category._id;
    //TODO:: set url with category instead of description -- descriptions could be too big
    const slugs = await makeSlug(store.name, req.body.description);
    req.body.slug = slugs;
    req.body.day.order = req.body.day.name.slice(0, 1);
    req.body.day.name = req.body.day.name.slice(2, req.body.day.name.length);
    req.body.day.daySlug = req.body.day.name.toLowerCase();
    const deal = await Deal.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true
    }).exec();
    req.flash('success', `Successfully update ${store.name}. <a href="/stores/${store.slug}">View Store</a>`);
    res.redirect(`/deals/${deal.id}/edit`);
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