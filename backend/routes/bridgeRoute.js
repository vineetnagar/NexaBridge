const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransaction,
  updateTransaction,
} = require("../controllers/bridgeController");

router.post("/createTransaction", createTransaction);

router.get("/getTransaction/:userAddress", getTransaction);
router.patch("/updateTransaction/:id", updateTransaction);
module.exports = router;
