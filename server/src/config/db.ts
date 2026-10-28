import mongoose from 'mongoose';

/**
 * MongoDB Atlas Database Connection Manager.
 * Concepts Used:
 * - Asynchronous Promises & `async/await`
 * - Mongoose ODM (Object Data Modeling) Connection (`mongoose.connect`)
 * - Non-blocking Fallback Error Handling (`try/catch`)
 */
export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('⚠️  MONGO_URI is not set in process.env. Backend running in In-Memory mode.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn('⚠️  MongoDB Connection Warning: Could not connect to MongoDB Atlas cluster.');
    console.warn('   Reason: Your IP address may not be whitelisted in MongoDB Atlas Network Access (0.0.0.0/0).');
    console.warn('   Fallback: Backend running seamlessly in In-Memory & Curated Data mode.');
  }
}
