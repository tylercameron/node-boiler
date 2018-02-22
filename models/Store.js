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
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
// }, {
//     //below is necessary because when adding object through virtuals it will not appear in teh JSON unless explicitely called. eg calling 'store' will not show reviews data, but calling 'store.reviews' will. adding this fixes this
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
});

// Define our indexes
// storeSchema.index({
//     name: "text",
//     address: "text"
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

// // find deals where the stores _id property === deals store property
// storeSchema.virtual("deals", {
//     ref: "Deal", // what model to link
//     localField: "_id", //which field on the store
//     foreignField: "store" //which field on the reivew
// });

// function autopopulate(next) {
//   this.populate("deals");
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