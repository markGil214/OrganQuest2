import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/organquest';

async function migrateUserIds() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}).sort({ createdAt: 1 });
    console.log(`Found ${users.length} users to migrate`);

    const roleSuffixes = {
      student: 'STUD',
      teacher: 'TEACH',
      admin: 'ADMIN',
      superuser: 'SUPER'
    };

    const year = '25'; // 2025

    // Track sequences for each role
    const sequences = {
      student: 0,
      teacher: 0,
      admin: 0,
      superuser: 0
    };

    for (const user of users) {
      sequences[user.role] = sequences[user.role] + 1;
      const sequence = sequences[user.role];
      const suffix = roleSuffixes[user.role] || 'USER';

      const newUserId = `${year}-${sequence.toString().padStart(4, '0')}-${suffix}`;

      console.log(`Updating ${user.fullName} (${user.role}): ${user.userId} -> ${newUserId}`);

      await User.findByIdAndUpdate(user._id, { userId: newUserId });
    }

    console.log('Migration completed successfully');
    console.log('Final sequences:', sequences);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateUserIds();