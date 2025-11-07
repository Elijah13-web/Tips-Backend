import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,       
        pass: process.env.GMAIL_APP_PASSWORD 
      },
    });

    // Email options
    const mailOptions = {
      from: `"TIPS Newsletter" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
    };

    // Send mail
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} (${subject})`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};

export default sendEmail;
