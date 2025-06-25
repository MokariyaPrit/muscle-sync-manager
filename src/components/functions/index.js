const functions = require("firebase-functions")
const admin = require("firebase-admin")
const nodemailer = require("nodemailer")

admin.initializeApp()

// Configure your test email credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your_email@gmail.com",
    pass: "your_app_password",
  },
})

exports.sendMembershipEmail = functions.firestore
  .document("memberships/{userId}")
  .onCreate(async (snap, context) => {
    const data = snap.data()

    const mailOptions = {
      from: '"Gym Membership" <your_email@gmail.com>',
      to: data.email,
      subject: "Thank You for Your Membership!",
      html: `
        <h2>Welcome to Premium!</h2>
        <p>Thank you for upgrading your plan.</p>
        <ul>
          <li><strong>Plan:</strong> ${data.plan}</li>
          <li><strong>Payment ID:</strong> ${data.paymentId}</li>
          <li><strong>Expires on:</strong> ${new Date(data.expiry).toLocaleDateString()}</li>
        </ul>
      `,
    }

    await transporter.sendMail(mailOptions)
  })
