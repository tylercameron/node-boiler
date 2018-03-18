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
    const customer = await stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    });

    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: 'test-vendor-pr' }],
    });

    req.user.vendor = true;
    req.user.stripeID = customer.id;
    req.user.stripeEmail = customer.email;
    req.user.stripeSubscripID = subscription.id;
    const user = await req.user.save();

    res.render('charge');
};

exports.cancelSubscription = async (req, res) => {
    if (req.user && req.user.vendor && req.user.stripeSubscripID) {
        await stripe.subscriptions.del(req.user.stripeSubscripID, { at_period_end: true });
        req.user.vendor = false;
        req.user.stripeSubscripID = null;
        const user = await req.user.save();
        req.flash('success', 'You have successfully cancelled your subscription.');
        res.redirect('/account');
    } else {
        req.flash('error', 'You must be a vendor to cancel subscription!');
        res.redirect('/account');
    }
};