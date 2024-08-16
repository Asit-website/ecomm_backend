const User = require("../models/userModel");
const Order = require("../models/orderModel");
const { ObjectId } = require("mongodb");
const Product = require("../models/productModel");

exports.fetchOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const userObj = new ObjectId(userId);

    const orderHistory = await Order.find({ userId: userObj }).populate(
      "products"
    );

    if (!orderHistory.length) {
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
    const { userId, products, shippingAddress } = req.body;

    if (!userId || !products || !shippingAddress) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Calculate totalAmount
    let totalAmount = 0;
    for (let productId of products) {
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: `Product not found: ${productId}` });
      }
      totalAmount += product.price;
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
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate("userId")
      .populate("products");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
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
    const orderId = req.params.id;
    const { orderStatus, shippingAddress } = req.body;

    const order = await Order.findById(orderId);

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
    const orderId = req.param.id;

    const order = await Order.findByIdAndDelete(orderId);

    if (!result) {
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
