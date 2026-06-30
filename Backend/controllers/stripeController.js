import Stripe from "stripe";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy");

export const createCheckoutSession = async (req, res) => {
    try {
        const { priceId } = req.body;
        const user = await User.findById(req.user._id); // Assuming protect middleware adds user

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // If user already has a stripe customer id, use it
        let customerId = user.stripeCustomerId;
        
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: {
                    userId: user._id.toString()
                }
            });
            customerId = customer.id;
            user.stripeCustomerId = customerId;
            await user.save();
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/pricing`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Stripe checkout error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const createPortalSession = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user || !user.stripeCustomerId) {
            return res.status(400).json({ message: "No active subscription found for user" });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.FRONTEND_URL}/dashboard`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
        // req.body should be raw buffer here, so we might need a special middleware in server.js
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const subscription = event.data.object;
                const customerId = subscription.customer;
                
                const user = await User.findOne({ stripeCustomerId: customerId });
                
                if (user) {
                    user.subscriptionStatus = subscription.status;
                    // Note: Here you'd map the Stripe Price ID to your tier ("Pro" or "Chef")
                    // This is a simplified mapping based on status
                    if (subscription.status === "active") {
                         // Ideally, check the price ID to set the exact tier. Defaulting to Pro for now.
                        user.subscriptionTier = "Pro";
                    } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
                        user.subscriptionTier = "Free";
                    }
                    await user.save();
                }
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        res.status(200).send();
    } catch (error) {
        console.error("Webhook handler failed:", error);
        res.status(500).send("Webhook handler failed");
    }
};
