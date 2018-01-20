const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const dealSchema = new mongoose.Schema({
    // created: {
    //     type: Date,
    //     default: Date.now
    // },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an Author'
    },
    store: {
        type: mongoose.Schema.ObjectId,
        ref: 'Store',
        required: 'You must supply a store'
    },
    storeName: String,
    day: {
        type: String,
        required: 'Your deal must have a day',
        lowercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: 'Your deal must have a price',
        trim: true
    },
    description: {
        type: String,
        required: 'Your deal must have text',
        trim: true
    },
    slug: String
    // day of week
    // price
    // description 
    // image (premium)
    // rating: {
    //     type: Number,
    //     min: 1,
    //     max: 5
    // }
// }, { //below is necessary because when adding object through virtuals it will not appear in teh JSON unless explicitely called. eg calling 'store' will not show reviews data, but calling 'store.reviews' will. adding this fixes this
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
});

dealSchema.pre("save", async function (next) {
    // if (!this.isModified("name")) {
    //     next(); //skip it
    //     return; // stop function from running
    // }
    
    this.slug = slug((this.storeName).concat(" ", this.description));

    const slugRegExp = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
    const dealsWithSlug = await this.constructor.find({ slug: slugRegExp });
    if (dealsWithSlug.length) {
        this.slug = `${this.slug}-${dealsWithSlug.length + 1}`;
    }
    next();
}); 

// dealSchema.statics.getStoreName = function () {
//     return this.aggregate([
//         {
//             $lookup: {
//                 from: 'stores', //this corresponds to 'Review' db. mongoose makes it lowercase and add an 's' on the end
//                 localField: '_id',
//                 foreignField: 'store',
//                 as: 'reviews'
//             }
//         },
//     ]);
// };

// function autopopulate(next) {
//     this.populate('author');
//     next();
// };

// dealSchema.pre('find', autopopulate);
// dealSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Deal', dealSchema);


// storeSchema.statics.getTagsList = function () {
//     return this.aggregate([
//         { $unwind: '$tags' },
//         { $group: { _id: '$tags', count: { $sum: 1 } } },
//         { $sort: { count: -1 } }
//     ]);
// };

// storeSchema.statics.getTopStores = function () {
//     return this.aggregate([
//         // Lookup stores and populate their reviews
//         {
//             $lookup: {
//                 from: 'reviews', //this corresponds to 'Review' db. mongoose makes it lowercase and add an 's' on the end
//                 localField: '_id',
//                 foreignField: 'store',
//                 as: 'reviews'
//             }
//         },
//         // filter for only items that have 2 or more reviews
//         {
//             $match: {
//                 'reviews.1': { $exists: true }
//             }
//         },
//         // add the average reviews field
//         {
//             $addFields: { // this is the same as below using $project -> only available in mongodb v3.4^. instead of creating new fields it just adds to existing
//                 averageRating: { $avg: '$reviews.rating' }
//             }
//         },
//         // { $project: {
//         //     photo: '$$ROOT.photo',
//         //     name: '$$ROOT.name',
//         //     reviews: '$$ROOT.reviews',
//         //     averageRating: { $avg: '$reviews.rating' }
//         // }},
//         // sort it by our new field, highest reviews first
//         {
//             $sort: {
//                 averageRating: -1
//             }
//         },
//         // limit to at most 10
//         { $limit: 10 }
//     ]);
// }