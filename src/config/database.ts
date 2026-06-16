import 'dotenv/config';
import mongoose from 'mongoose';

const mongoURI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/taskinsight';

mongoose.connect(mongoURI);

mongoose.connection.on('connected', () => {
  console.log('Connected to database successfully');
});

mongoose.connection.on('error', (err: Error) => {
  console.log('Failed to connect to database', err.message);
});

export default mongoose;
