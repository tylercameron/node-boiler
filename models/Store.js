const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const slug = require("slugs");

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: "Please enter a store name!"
    },
    slug: String,
    // description: {
    //     type: String,
    //     trim: true
    // },
    // tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: [
            {
                type: Number
            }
        ],
        address: {
            type: String,
            required: "You must supply an address."
        }
    },
    photo: String,
    url: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'You must supply an author.'
    }
}
//   {
//     //below is necessary because when adding object through virtuals it will not appear in teh JSON unless explicitely called. eg calling 'store' will not show reviews data, but calling 'store.reviews' will. adding this fixes this
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
);

// Define our indexes
// storeSchema.index({
//     name: "text",
//     description: "text"
// });

// storeSchema.index({ location: "2dsphere" });

storeSchema.pre("save", async function(next) {
    if (!this.isModified("name")) {
        next(); //skip it
        return; // stop function from running
    }
    this.slug = slug(this.name);

    const slugRegExp = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
    const storesWithSlug = await this.constructor.find({ slug: slugRegExp });
    if (storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }
    next();
}); 

// storeSchema.statics.getTagsList = function() {
//   return this.aggregate([
//     { $unwind: "$tags" },
//     { $group: { _id: "$tags", count: { $sum: 1 } } },
//     { $sort: { count: -1 } }
//   ]);
// };

// storeSchema.statics.getTopStores = function() {
//   return this.aggregate([
//     // Lookup stores and populate their reviews
//     {
//       $lookup: {
//         from: "reviews", //this corresponds to 'Review' db. mongoose makes it lowercase and add an 's' on the end
//         localField: "_id",
//         foreignField: "store",
//         as: "reviews"
//       }
//     },
//     // filter for only items that have 2 or more reviews
//     {
//       $match: {
//         "reviews.1": { $exists: true }
//       }
//     },
//     // add the average reviews field
//     {
//       $addFields: {
//         // this is the same as below using $project -> only available in mongodb v3.4^. instead of creating new fields it just adds to existing
//         averageRating: { $avg: "$reviews.rating" }
//       }
//     },
//     // { $project: {
//     //     photo: '$$ROOT.photo',
//     //     name: '$$ROOT.name',
//     //     reviews: '$$ROOT.reviews',
//     //     averageRating: { $avg: '$reviews.rating' }
//     // }},
//     // sort it by our new field, highest reviews first
//     {
//       $sort: {
//         averageRating: -1
//       }
//     },
//     // limit to at most 10
//     { $limit: 10 }
//   ]);
// };

// find reviews where the stores _id property === reviews store property
// storeSchema.virtual("reviews", {
//     ref: "Review", // what model to link
//     localField: "_id", //which field on the store
//     foreignField: "store" //which field on the reivew
// });

// function autopopulate(next) {
//   this.populate("reviews");
//   return next();
// }

// storeSchema.pre("find", autopopulate);
// storeSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Store", storeSchema);


// Name
// Slug?
// Image
// Address
// Coordinates (map)
// Phone #
// Website Link
// Owner (User) (Through Restaurant)
// Deals
// Vendor Status (boolean)
// Reviews (Google API)