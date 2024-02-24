const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

exports.handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Retrieve the user by email or a custom field you added to Stripe checkout
        const userEmail = session.customer_email; // Or use metadata to retrieve user ID or email
        try {
            await User.updatePremiumStatus(userEmail, true); // Implement this method in your User model
            res.status(200).send({ received: true });
        } catch (error) {
            res.status(500).send('Failed to update user premium status');
        }
    } else {
        res.status(200).send({ received: true });
    }
};
