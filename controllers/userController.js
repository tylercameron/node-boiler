const keyPublishable = process.env.STRIPE_PUBLIC_KEY;
const keySecret = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(keySecret);

const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

exports.account = (req, res) => {
    res.render('account', { title: 'Edit your account' });
};

exports.stripe = (req, res) => {
    res.render('stripe', { title: 'Vendor Registration', keyPublishable });
};

exports.payment = async (req, res) => {
    const amount = 500;

    const customer = await stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    });
    console.log(customer);
    const charge = await stripe.charges.create({
        amount,
        description: "Sample Charge",
        currency: "usd",
        customer: customer.id
    });
    res.render('charge');
};