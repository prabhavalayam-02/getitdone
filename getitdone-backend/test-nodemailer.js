// Quick test to verify nodemailer works
const nodemailer = require('nodemailer');

console.log('Nodemailer loaded:', typeof nodemailer);
console.log('createTransporter exists:', typeof nodemailer.createTransporter);

if (typeof nodemailer.createTransporter === 'function') {
  console.log('✅ Nodemailer is working correctly!');
} else {
  console.log('❌ Nodemailer createTransporter is not a function');
  console.log('Nodemailer object:', nodemailer);
}
