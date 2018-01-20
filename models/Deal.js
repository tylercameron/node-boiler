const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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
    }
    // day of week
    // price
    // description 
    // image (premium)
    // rating: {
    //     type: Number,
    //     min: 1,
    //     max: 5
    // }
});

// function autopopulate(next) {
//     this.populate('author');
//     next();
// };

// dealSchema.pre('find', autopopulate);
// dealSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Deal', dealSchema);