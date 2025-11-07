import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    // 📨 Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,        // ✅ Your Gmail address
        pass: process.env.ADMIN_EMAIL_PASS,   // ✅ Your Gmail app password
      },
    });

    // ✉️ Define mail options
    const mailOptions = {
      from: `"TIPS Newsletter" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
    };

    // 🚀 Send email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

export default sendEmail;
