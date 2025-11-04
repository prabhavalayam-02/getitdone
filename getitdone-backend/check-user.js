const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    
    console.log(`\n=== Found ${users.length} users in database ===\n`);
    
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log('  Email:', user.email);
      console.log('  Name:', user.name);
      console.log('  Role:', user.role);
      console.log('  Helper Status:', user.helperStatus || 'N/A');
      console.log('  ID:', user._id);
      console.log('');
    });

    // Check for helpers specifically
    const helpers = await User.find({ role: 'helper' });
    console.log(`\n=== Found ${helpers.length} helpers ===`);
    helpers.forEach((helper, index) => {
      console.log(`Helper ${index + 1}:`);
      console.log('  Email:', helper.email);
      console.log('  Status:', helper.helperStatus);
      console.log('');
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser();
