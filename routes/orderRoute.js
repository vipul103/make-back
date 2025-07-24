const express = require("express");
const {
  paymentIntent,
  addOrder,
  getSingleOrder,
  updateOrderStatus,
  getOrders,
  createRazorpayOrder,
  sendOrderMailController, // ✅ Import email controller
} = require("../controller/orderController");

const router = express.Router();

// ✅ Send order confirmation email
router.post("/send-mail", sendOrderMailController);

// ✅ Get all orders
router.get("/orders", getOrders);

// ❌ Stripe route disabled (optional)
// router.post("/create-payment-intent", paymentIntent);

// ✅ Razorpay order creation
router.post("/create-razorpay-order", createRazorpayOrder);

// ✅ Add new order
router.post("/addOrder", addOrder);

// ✅ Get single order
router.get("/:id", getSingleOrder);

// ✅ Update order status
router.patch("/update-status/:id", updateOrderStatus);

module.exports = router;
