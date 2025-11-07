import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    // 🧠 Debugging: Check that environment variables are loading correctly
    console.log("🧠 ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
    console.log(
      "🧠 ADMIN_EMAIL_PASS:",
      process.env.ADMIN_EMAIL_PASS ? "Loaded ✅" : "❌ Missing"
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,       // ✅ from .env
        pass: process.env.ADMIN_EMAIL_PASS,  // ✅ from .env
      },
    });

    const mailOptions = {
      from: `"TIPS Newsletter" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

export default sendEmail;
