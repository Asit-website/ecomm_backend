const mongoose = require("mongoose");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const { ObjectId } = require("mongodb");
const Product = require("../models/productModel");

exports.fetchOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const userObj = new ObjectId(userId);

    const orderHistory = await Order.find({ userId: userObj }).populate(
      "products"
    );

    if (orderHistory.length === 0) {
      return res.status(403).json({
        success: false,
        message: "No order history found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfuly found the order histroy",
      orderHistory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, shippingAddress } = req.body;

    if (!userId || !products || !totalAmount || !shippingAddress) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // create the order
    const newOrder = await Order.create({
      userId,
      products,
      totalAmount,
      shippingAddress,
      orderStatus: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order created succesfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.fetchSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    console.log(`Fetching order with ID: ${orderId}`);

    const order = await Order.findById({
      _id: orderId,
    })
      .populate("userId")
      .populate("products");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetch order",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, shippingAddress } = req.body;

    const order = await Order.findById({
      _id: orderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (shippingAddress) order.shippingAddress = shippingAddress;

    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated succesfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete({
      _id: orderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order deleted succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
