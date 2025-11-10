import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async (to, subject, html, attachmentPath = null) => {
  try {
    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    // ✅ Mail options
    const mailOptions = {
      from: `"Tips Education" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
    };

    // ✅ Add attachment if provided
    if (attachmentPath) {
      mailOptions.attachments = [
        {
          filename: attachmentPath.split('/').pop(),
          path: attachmentPath,
        },
      ];
    }

    // ✅ Send mail
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};

export default sendEmail;
