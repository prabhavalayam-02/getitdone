const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function fixUserRole() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Revert user role back to "user" (tasker) for niya@gmail.com
    const result = await User.updateOne(
      { email: 'niya@gmail.com' },
      { 
        $set: { 
          role: 'user'
        } 
      }
    );

    console.log('\n=== Update Result ===');
    console.log('Matched:', result.matchedCount);
    console.log('Modified:', result.modifiedCount);

    // Verify the update
    const user = await User.findOne({ email: 'niya@gmail.com' });
    if (user) {
      console.log('\n=== Updated User Details ===');
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Role:', user.role);
      console.log('Helper Status:', user.helperStatus);
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    console.log('\n✅ User role reverted to "user". You can now both post AND accept tasks!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixUserRole();
