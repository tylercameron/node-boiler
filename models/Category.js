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

categorySchema.pre("save", async function (next) {
    if (!this.isModified("category")) {
        next(); //skip it
        return; // stop function from running
    }
    this.slug = slug(this.category);

    // const slugRegExp = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
    // const categoryWithSlug = await this.constructor.find({ slug: slugRegExp });
    // if (categoryWithSlug.length) {
    //     this.slug = `${this.slug}-${categoryWithSlug.length + 1}`;
    // }
    next();
}); 

module.exports = mongoose.model('Category', categorySchema);