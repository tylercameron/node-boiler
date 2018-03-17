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
    console.log('user', req.user);
    req.user.stripeID = customer.id;
    req.user.stripeEmail = customer.email;
    const user = await req.user.save();
    console.log('user2', req.user);
    // const charge = await stripe.charges.create({
    //     amount,
    //     description: "Sample Charge",
    //     currency: "usd",
    //     customer: customer.id
    // });
    // const plan = stripe.plans.create({
    //     product: { name: "Basic Product" },
    //     currency: 'usd',
    //     interval: 'month',
    //     nickname: 'Basic Monthly',
    //     amount: 0,
    // });
    const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: 'plan_CU8CiwI7NurUjs' }],
    });
    res.render('charge');
};