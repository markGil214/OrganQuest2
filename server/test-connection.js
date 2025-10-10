// Quick test to verify MongoDB connection
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI?.replace(/Marco214/, '****')); // Hide password in logs
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Test creating a sample document
    const TestSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', TestSchema);
    
    const doc = await TestModel.create({ test: 'Connection test successful!' });
    console.log('✅ Test document created:', doc._id);
    
    await TestModel.deleteOne({ _id: doc._id });
    console.log('✅ Test document deleted');
    
    await mongoose.connection.close();
    console.log('✅ Connection closed. Everything works!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 Possible solutions:');
      console.error('  1. Check username and password are correct');
      console.error('  2. Make sure IP address is whitelisted in MongoDB Atlas');
      console.error('  3. Verify database user has correct permissions');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Possible solutions:');
      console.error('  1. Check internet connection');
      console.error('  2. Verify cluster URL is correct');
    }
    
    process.exit(1);
  }
};

testConnection();
