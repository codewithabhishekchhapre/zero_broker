const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/Subscription");
const Wallet=require("../models/wallet")


exports.handleStripeWebhook = async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).json({ error: "Webhook Error" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Find the related subscription
    const subscription = await Subscription.findOne({ transactionId: session.id });
    if (!subscription) return res.status(404).json({ error: "Subscription not found" });

    // Update Subscription Status
    subscription.paymentStatus = "completed";
    subscription.status = "active";
    await subscription.save();

    // 🔹 Create Wallet Entry
    const wallet = new Wallet({
      user: subscription.user,
      balance: subscription.price, // Initial wallet balance (can be modified)
      transactionId: session.id,
      lastTransactionDate: new Date(),
    });
    await wallet.save();

    console.log("Payment successful. Subscription activated and wallet created.");
  } else if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    await Subscription.findOneAndUpdate(
      { transactionId: session.id },
      { paymentStatus: "failed" }
    );
    console.log("Payment failed. Subscription marked as failed.");
  }

  res.status(200).json({ received: true });
};