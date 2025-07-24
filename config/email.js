// require("dotenv").config();
// const nodemailer = require("nodemailer");
// const { secret } = require("./secret");

// // ✅ Setup Nodemailer transporter for Ethereal
// const transporter = nodemailer.createTransport({
//   host: secret.email_host, // e.g. smtp.ethereal.email
//   port: Number(secret.email_port) || 587,
//   secure: false, // use STARTTLS (false for port 587)
//   auth: {
//     user: secret.email_user,
//     pass: secret.email_pass,
//   },
// });

// // ✅ Verify transporter connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Email transporter verification failed:", error.message);
//   } else {
//     console.log("✅ Email transporter is ready");
//   }
// });

// // ✅ Generic email sender
// const sendEmail = async (mailData, res, message) => {
//   try {
//     const info = await transporter.sendMail(mailData);
//     const previewUrl = nodemailer.getTestMessageUrl(info);

//     console.log("📤 Message sent:", info.messageId);
//     console.log("🔗 Preview URL:", previewUrl);

//     if (res) {
//       res.status(200).json({
//         success: true,
//         message,
//         preview: previewUrl,
//       });
//     }
//   } catch (error) {
//     console.error("❌ Email send error:", error.message);
//     if (res) {
//       res.status(500).json({
//         success: false,
//         message: "Email not sent",
//         error: error.message,
//       });
//     }
//   }
// };

// // ✅ Order-specific email sender
// const sendOrderEmail = async (orderDetails) => {
//   try {
//     const {
//       name,
//       email,
//       contact,
//       address,
//       city,
//       zipCode,
//       country,
//       shippingOption,
//       shippingCost,
//       discount,
//       subTotal,
//       totalAmount,
//       cart = [],
//     } = orderDetails;

//     const html = `
//       <h2>🛒 New Order Received</h2>
//       <p><strong>Customer Name:</strong> ${name}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Phone:</strong> ${contact}</p>
//       <p><strong>Address:</strong> ${address}, ${city}, ${zipCode}, ${country}</p>
//       <p><strong>Shipping:</strong> ${shippingOption} (₹${shippingCost})</p>
//       <p><strong>Subtotal:</strong> ₹${subTotal}</p>
//       <p><strong>Discount:</strong> ₹${discount}</p>
//       <p><strong>Total:</strong> ₹${totalAmount}</p>
//       <h3>🧺 Items Ordered:</h3>
//       <ul>
//         ${cart
//           .map(
//             (item) =>
//               `<li>${item.title} × ${item.orderQuantity} – ₹${item.originalPrice}</li>`
//           )
//           .join("")}
//       </ul>
//     `;

//     const mailOptions = {
//       from: secret.email_user,
//       to: secret.email_user, // admin receives the order
//       subject: `🛍 New Order from ${name}`,
//       html,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     const previewUrl = nodemailer.getTestMessageUrl(info);

//     console.log("📨 Order email sent:", info.messageId);
//     console.log("🔗 Preview URL:", previewUrl);

//     return { success: true, preview: previewUrl };
//   } catch (err) {
//     console.error("❌ Order email failed:", err.message);
//     return { success: false, error: err.message };
//   }
// };

// module.exports = {
//   sendEmail,
//   sendOrderEmail,
// };
require("dotenv").config();
const nodemailer = require("nodemailer");
const { secret } = require("./secret");

// ✅ Setup Nodemailer transporter for Ethereal
const transporter = nodemailer.createTransport({
  host: secret.email_host, // e.g. smtp.ethereal.email
  port: Number(secret.email_port) || 587,
  secure: false, // use STARTTLS (false for port 587)
  auth: {
    user: secret.email_user,
    pass: secret.email_pass,
  },
});

// ✅ Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error.message);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

// ✅ Generic email sender
const sendEmail = async (mailData) => {
  try {
    const info = await transporter.sendMail(mailData);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log("📤 Message sent:", info.messageId);
    console.log("🔗 Preview URL:", previewUrl);

    return { success: true, previewUrl };
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    return { success: false, error: error.message };
  }
};

// ✅ Order-specific email sender
const sendOrderEmail = async (orderDetails) => {
  try {
    const {
      name,
      email,
      contact,
      address,
      city,
      zipCode,
      country,
      shippingOption,
      shippingCost,
      discount,
      subTotal,
      totalAmount,
      cart = [],
    } = orderDetails;

    const html = `
      <h2>🛒 New Order Received</h2>
      <p><strong>Customer Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${contact}</p>
      <p><strong>Address:</strong> ${address}, ${city}, ${zipCode}, ${country}</p>
      <p><strong>Shipping:</strong> ${shippingOption} (₹${shippingCost})</p>
      <p><strong>Subtotal:</strong> ₹${subTotal}</p>
      <p><strong>Discount:</strong> ₹${discount}</p>
      <p><strong>Total:</strong> ₹${totalAmount}</p>
      <h3>🧺 Items Ordered:</h3>
      <ul>
        ${cart
          .map(
            (item) =>
              `<li>${item.title} × ${item.orderQuantity} – ₹${item.originalPrice}</li>`
          )
          .join("")}
      </ul>
    `;

    const mailOptions = {
      from: secret.email_user,
      to: secret.email_user, // admin receives the order
      subject: `🛍 New Order from ${name}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    console.log("📨 Order email sent:", info.messageId);
    console.log("🔗 Preview URL:", previewUrl);

    return { success: true, preview: previewUrl };
  } catch (err) {
    console.error("❌ Order email failed:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendEmail,
  sendOrderEmail,
};
