const mongoose = require("mongoose");

const Transaction = new mongoose.Schema(
  {
    userAddress: {
      type: String,
      required: [true, "user address is required."],
    },
    sourceChain: {
      type: String,
      required: [true, "Source Chain is required."],
    },
    destinationChain: {
      type: String,
      required: [true, "Destination Chain is required."],
    },
    txHash: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

const userTransaction = mongoose.model("Transaction", Transaction);

module.exports = userTransaction;
