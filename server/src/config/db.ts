import mongoose from 'mongoose';

// Fail queries immediately when the DB is unreachable so the controllers'
// existing in-memory/curated fallbacks respond at once instead of hanging.
mongoose.set('bufferCommands', false);

export async function connectDB(): Promise<boolean> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('⚠️  MONGO_URI is not set in process.env. Backend running in In-Memory mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn('⚠️  MongoDB Connection Warning: Could not connect to MongoDB Atlas cluster.');
    console.warn('   Reason: Your IP address may not be whitelisted in MongoDB Atlas Network Access (0.0.0.0/0).');
    console.warn('   Fallback: Backend running seamlessly in In-Memory & Curated Data mode.');
    return false;
  }
}
