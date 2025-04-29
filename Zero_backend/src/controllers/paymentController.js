const stripe = require("../config/stripe");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");
exports.createCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user.id;

    if (!req.user.email) {
      return res.status(400).json({ error: "User email is required" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ error: "Plan not found" });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: plan.name },
            unit_amount: plan.price * 100,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
    });

    // Create Subscription in Pending Status
    await Subscription.create({
      user: userId,
      plan: planId,
      price:plan.price,
      category:plan.category,
      transactionId: session.id, // Store Stripe session ID
      paymentStatus: "pending",
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};