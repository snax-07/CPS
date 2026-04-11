import { IdbMetadata } from '../types/dbModel.ts';
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';


configDotenv();
const dbMetadata : IdbMetadata = {}

const connectDB = async (): Promise<void> => {
  try {
    if(dbMetadata.isConnected){
        console.log("⚙️ Mongo DB is already connected !!!");
        return;
    }
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    dbMetadata.isConnected = conn.connection.readyState as number;
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    process.exit(1);
  }
};


export default connectDB;