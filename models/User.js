const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const { isEmail } = require('validator');
// const mongodbErrorHandler = require('mongoose-mongodb-errors');

const userSchema = new Schema({
    googleId: String,
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: { 
            isAsync: true,
            validator: isEmail, 
            message: 'Invalid email.' 
        },
        required: 'Please Supply an email address'
    },
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    vendor: Boolean,
    stripeID: String,
    stripeEmail: String,
    stripeSubscripID: String,
    userAuth: Number
});

userSchema.virtual('gravatar').get(function () {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
});

// userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);

// USER AUTH FIELD ::::     11 = Subscriber, 21 = Registered User, 31 = Vendor User, 41 = Admin