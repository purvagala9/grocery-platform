const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

const adjustInventory = async (order, direction) => {
  for (const item of order.items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      continue;
    }

    const delta = Number(item.quantity) || 0;
    if (direction === "decrease") {
      product.quantity = Math.max(0, product.quantity - delta);
    } else if (direction === "increase") {
      product.quantity = Number(product.quantity) + delta;
    }

    await product.save();
  }
};


// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      phone,
      address,
      items,
      totalAmount,
      deliveryType,
      preferredTime,
    } = req.body;

    if (!customerName || !phone) {
      return res.status(400).json({
        message: "Customer name and phone are required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    const lastOrder = await Order.findOne().sort({ orderId: -1 }).select("orderId");
    const orderId = (lastOrder?.orderId || 0) + 1;
    const tokenNo = deliveryType === "Takeaway from store" ? orderId : null;

    const order = new Order({
      orderId,
      tokenNo,
      customerId: customerId || null,
      customerName,
      phone,
      address,
      items,
      totalAmount,
      deliveryType,
      preferredTime:
        deliveryType === "Home Delivery"
          ? preferredTime
          : "",
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});


// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});


// GET SINGLE ORDER
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});


// UPDATE ORDER STATUS
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Accepted",
      "Preparing",
      "Ready",
      "Completed",
      "Cancelled",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status === "Cancelled") {
      if (status === "Cancelled") {
        return res.status(200).json(order);
      }

      return res.status(400).json({
        message: "Cancelled orders cannot be updated.",
      });
    }

    if (status === "Completed" && order.status === "Completed") {
      return res.status(200).json(order);
    }

    if (status === "Completed" && !order.inventoryUpdated) {
      await adjustInventory(order, "decrease");
      order.inventoryUpdated = true;
    }

    const cancelWindowStatuses = ["Pending", "Accepted", "Preparing"];
    if (status === "Cancelled" && !cancelWindowStatuses.includes(order.status)) {
      return res.status(400).json({
        message: "Order can only be cancelled before it is ready.",
      });
    }

    if (status === "Rejected" && order.inventoryUpdated) {
      await adjustInventory(order, "increase");
      order.inventoryUpdated = false;
    }

    order.status = status;

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);

  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});


module.exports = router;
