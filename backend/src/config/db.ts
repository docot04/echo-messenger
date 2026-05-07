import { ENV } from "./env";
import mongoose from "mongoose";

export async function connectDB() {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: any) {
    console.log(`MongoDB Error: ${err.message}`);
    process.exit(1);
  }
}
