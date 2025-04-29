const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");


// ✅ Get Active Subscriptions
exports.getActiveSubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await Subscription.find({ user: userId, status: "active" }).populate("plan");

    res.status(200).json({ subscriptions });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Cancel Subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const userId = req.user.id;

    const subscription = await Subscription.findOne({ _id: subscriptionId, user: userId });
    if (!subscription) return res.status(404).json({ message: "Subscription not found" });

    subscription.status = "canceled";
    await subscription.save();
    res.status(200).json({ message: "Subscription canceled", subscription });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Verify Payment & Activate Subscription
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // Find the subscription and update status
    const subscription = await Subscription.findOne({ transactionId: paymentIntentId });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.paymentStatus = "completed";
    subscription.status = "active";
    await subscription.save();

    res.status(200).json({ message: "Subscription activated", subscription });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
