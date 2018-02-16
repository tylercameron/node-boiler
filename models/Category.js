const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        unique: true,
        required: 'Your must have a category.',
        trim: true
    },
    slug: String,
    photo: String
});

// Define our indexes
categorySchema.index({
    category: "text"
});

categorySchema.pre("save", async function (next) {
    if (!this.isModified("category")) {
        next(); //skip it
        return; // stop function from running
    }
    this.slug = slug(this.category);
    next();
}); 

categorySchema.statics.getCategoriesList = function () {
    // this.populate('category');
    return this.aggregate([
        { $group: { _id: '$_id', category: { $first: '$category' } } }
        // {
        //     $lookup: {
        //         from: 'categories', //this corresponds to 'Review' db. mongoose makes it lowercase and add an 's' on the end
        //         localField: 'category',
        //         foreignField: '_id',
        //         as: 'categories'
        //     }
        // }
    ]);
};

module.exports = mongoose.model('Category', categorySchema);