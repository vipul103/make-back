// const { secret } = require("../config/secret");
// const Razorpay = require("razorpay");
// const Order = require("../models/Order");
// const { sendEmail } = require("../config/email"); // ✅ Use sendEmail function

// // Razorpay instance
// const razorpay = new Razorpay({
//   key_id: secret.razorpay_key_id,
//   key_secret: secret.razorpay_key_secret,
// });

// // ✅ Utility to generate HTML email content
// const generateOrderHTML = (order) => {
//   return `
//     <h3>New Order Received</h3>
//     <p><strong>Name:</strong> ${order.name}</p>
//     <p><strong>Email:</strong> ${order.email}</p>
//     <p><strong>Contact:</strong> ${order.contact}</p>
//     <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.zipCode}, ${order.country}</p>
//     <p><strong>Shipping:</strong> ${order.shippingOption}</p>
//     <p><strong>Subtotal:</strong> ₹${order.subTotal}</p>
//     <p><strong>Shipping:</strong> ₹${order.shippingCost}</p>
//     <p><strong>Discount:</strong> ₹${order.discount}</p>
//     <p><strong>Total:</strong> ₹${order.totalAmount}</p>
//     <h4>Cart Items:</h4>
//     <ul>
//       ${order.cart
//         .map(
//           (item) =>
//             `<li>${item.title} — Qty: ${item.orderQuantity} — Price: ₹${item.originalPrice}</li>`
//         )
//         .join("")}
//     </ul>
//   `;
// };

// // ✅ ADD ORDER (Save + send email)
// const addOrder = async (req, res) => {
//   try {
//     const newOrder = new Order(req.body);
//     const savedOrder = await newOrder.save();
//     const order = await Order.findById(savedOrder._id).populate("user");

//     // Send order email to admin
//     const mailData = {
//       from: secret.email_user,
//       to: secret.email_user,
//       subject: "📦 New Order Received",
//       html: generateOrderHTML(req.body),
//     };

//     await sendEmail(mailData, res, "✅ Order email sent");

//     res.status(201).json({
//       success: true,
//       message: "✅ Order saved and email sent",
//       order,
//     });
//   } catch (error) {
//     console.error("❌ Add Order Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ CREATE RAZORPAY ORDER
// const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount) {
//       return res.status(400).json({ error: "Amount is required" });
//     }

//     const options = {
//       amount: amount * 100,
//       currency: "INR",
//       receipt: `order_rcptid_${Date.now()}`,
//       payment_capture: 1,
//     };

//     const response = await razorpay.orders.create(options);

//     res.status(200).json({
//       id: response.id,
//       currency: response.currency,
//       amount: response.amount,
//     });
//   } catch (err) {
//     console.error("❌ Razorpay Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// // ✅ GET SINGLE ORDER
// const getSingleOrder = async (req, res, next) => {
//   try {
//     const orderItem = await Order.findById(req.params.id).populate("user");
//     res.status(200).json(orderItem);
//   } catch (error) {
//     console.log("❌ Get Single Order Error:", error);
//     next(error);
//   }
// };

// // ✅ UPDATE ORDER STATUS
// const updateOrderStatus = async (req, res) => {
//   try {
//     await Order.updateOne(
//       { _id: req.params.id },
//       { $set: { status: req.body.status } },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "✅ Status updated successfully",
//     });
//   } catch (error) {
//     console.log("❌ Update Status Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ GET ALL ORDERS
// const getOrders = async (req, res, next) => {
//   try {
//     const orderItems = await Order.find({})
//       .sort({ createdAt: -1 })
//       .populate("user");

//     res.status(200).json({
//       success: true,
//       data: orderItems,
//     });
//   } catch (error) {
//     console.log("❌ Get Orders Error:", error);
//     next(error);
//   }
// };

// // ✅ MANUAL EMAIL CONTROLLER
// const sendOrderMailController = async (req, res) => {
//   try {
//     const { orderInfo } = req.body;

//     if (!orderInfo || !orderInfo.email) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing order information",
//       });
//     }

//     const mailData = {
//       from: secret.email_user,
//       to: secret.email_user,
//       subject: "📦 New Order (Manual Email)",
//       html: generateOrderHTML(orderInfo),
//     };

//     await sendEmail(mailData, res, "✅ Manual order email sent");
//   } catch (error) {
//     console.log("🚀 Sending email with order info:", mailData);
// await sendEmail(mailData, res, "Order email sent!");

//     console.error("❌ Email Send Error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // ✅ EXPORT ALL CONTROLLERS
// module.exports = {
//   addOrder,
//   getSingleOrder,
//   updateOrderStatus,
//   getOrders,
//   createRazorpayOrder,
//   sendOrderMailController,
// };
const { secret } = require("../config/secret");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const { sendEmail } = require("../config/email");

const razorpay = new Razorpay({
  key_id: secret.razorpay_key_id,
  key_secret: secret.razorpay_key_secret,
});

// ✅ Generate Email HTML
const generateOrderHTML = (order) => {
  const items = Array.isArray(order.products)
    ? order.products
    : [];

  return `
    <h3>New Order Received</h3>
    <p><strong>Name:</strong> ${order.name}</p>
    <p><strong>Email:</strong> ${order.email}</p>
    <p><strong>Contact:</strong> ${order.contact}</p>
    <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.zipCode}, ${order.country}</p>
    <p><strong>Subtotal:</strong> ₹${order.subTotal}</p>
    <p><strong>Shipping:</strong> ₹${order.shippingCost}</p>
    <p><strong>Total:</strong> ₹${order.totalAmount}</p>
    <h4>Cart Items:</h4>
    <ul>
      ${items
        .map(
          (item) =>
            `<li>${item.title} — Qty: ${item.quantity || item.orderQuantity || 1} — Price: ₹${item.originalPrice}</li>`
        )
        .join("")}
    </ul>
  `;
};

// ✅ Add Order
const addOrder = async (req, res) => {
  try {
    console.log("📦 Incoming order:", req.body);

    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    const order = await Order.findById(savedOrder._id).populate("user");

    const mailData = {
      from: secret.email_user,
      to: secret.email_user,
      subject: "📦 New Order Received",
      html: generateOrderHTML(req.body),
    };

    const emailResult = await sendEmail(mailData); // no res here

    res.status(201).json({
      success: true,
      message: "✅ Order saved and email sent",
      emailStatus: emailResult,
      order,
    });
  } catch (error) {
    console.error("❌ Add Order Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
      payment_capture: 1,
    };

    const response = await razorpay.orders.create(options);

    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.error("❌ Razorpay Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get One Order
const getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate("user");
    res.status(200).json(orderItem);
  } catch (error) {
    console.log("❌ Get Single Order Error:", error);
    next(error);
  }
};

// ✅ Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    await Order.updateOne(
      { _id: req.params.id },
      { $set: { status: req.body.status } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "✅ Status updated successfully",
    });
  } catch (error) {
    console.log("❌ Update Status Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Orders
const getOrders = async (req, res, next) => {
  try {
    const orderItems = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user");

    res.status(200).json({
      success: true,
      data: orderItems,
    });
  } catch (error) {
    console.log("❌ Get Orders Error:", error);
    next(error);
  }
};

// ✅ Send Manual Email
const sendOrderMailController = async (req, res) => {
  try {
    const { orderInfo } = req.body;

    if (!orderInfo || !orderInfo.email) {
      return res.status(400).json({
        success: false,
        message: "Missing order information",
      });
    }

    const mailData = {
      from: secret.email_user,
      to: secret.email_user,
      subject: "📦 New Order (Manual Email)",
      html: generateOrderHTML(orderInfo),
    };

    await sendEmail(mailData, res, "✅ Manual order email sent");
  } catch (error) {
    console.error("❌ Email Send Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Export
module.exports = {
  addOrder,
  getSingleOrder,
  updateOrderStatus,
  getOrders,
  createRazorpayOrder,
  sendOrderMailController,
};