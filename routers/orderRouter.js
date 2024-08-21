const express = require("express");
const router = express.Router();

const {
  createOrder,
  fetchOrderHistory,
  fetchSingleOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/OrderController");
const { isAdmin, isUser, auth } = require("../middleware/auth");

/** http://localhost:4000/api/v1/orders/..... */

router.get("/orders/orderHistory", auth, fetchOrderHistory);

router.post("/orders/add-order", createOrder);

router.get("/orders/:orderId", fetchSingleOrder);

router.put("/orders/:orderId", updateOrder);

router.delete("/orders/:orderId", deleteOrder);

module.exports = router;
