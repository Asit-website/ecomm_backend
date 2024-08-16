const express = require("express");
const router = express.Router();

const {
  createOrder,
  fetchOrderHistory,
  fetchSingleOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/OrderController");
const { isAdmin, isUser } = require("../middleware/auth");

/** http://localhost:4000/api/v1/orders/..... */

router.get("/", fetchOrderHistory, isAdmin);

router.post("/add-order", createOrder, isAdmin, isUser);

router.get("/:id", fetchSingleOrder, isAdmin);

router.put("/:id", updateOrder, isAdmin);

router.delete("/:id", deleteOrder, isAdmin);

module.exports = router;
