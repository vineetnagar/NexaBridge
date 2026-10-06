const express = require("express");
const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { userAddress, sourceChain, destinationChain, status, txHash } =
      req.body;
    const newTransaction = await Transaction.create({
      userAddress,
      sourceChain,
      destinationChain,
      status,
      txHash,
    });
    res.status(201).json({
      status: "Transaction created successfully",
      data: newTransaction,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error in creating Transaction",
      message: error.message,
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const { userAddress } = req.params;
    const getUsertransaction = await Transaction.find({
      userAddress: userAddress,
    });
    res.status(201).json({
      status: "User Transactions fetched",
      data: getUsertransaction,
    });
  } catch (error) {
    res.status(500).json({ status: "Error in getting user Transactions" });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updateTransactionStatus = await Transaction.findByIdAndUpdate(
      id,
      { status: "Completed" },
      { new: true },
    );
    res.status(201).json({ status: "Success", data: updateTransactionStatus });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};
