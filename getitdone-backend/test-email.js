require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing email configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓ Set' : '✗ Not set');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

console.log('\n✅ Email transporter created successfully!');
console.log('Sending test email...\n');

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // Send to yourself
  subject: 'GetItDone - Email Test',
  html: `
    <h2>Email Service is Working! ✅</h2>
    <p>This is a test email from GetItDone backend.</p>
    <p>Email notifications are now configured and working properly.</p>
  `,
}, (error, info) => {
  if (error) {
    console.log('❌ Error sending email:', error.message);
  } else {
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nCheck your inbox at:', process.env.EMAIL_USER);
  }
  process.exit(0);
});
