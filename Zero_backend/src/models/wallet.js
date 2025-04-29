const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  transactionId: {
    type: String,
    unique: true
  },
  lastTransactionDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);
