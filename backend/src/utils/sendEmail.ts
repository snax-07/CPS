import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Placement Cell" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
            <h2>Placement Management System</h2>
            <p>${options.message}</p>
            <br />
            <p>Regards,<br />Admin Team</p>
          </div>`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;