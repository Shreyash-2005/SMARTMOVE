import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb(){
  if(!env.mongoUri) throw new Error("MONGODB_URI is missing. Add your MongoDB Atlas connection string to backend/.env");
  await mongoose.connect(env.mongoUri,{serverSelectionTimeoutMS:10000});
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
export async function testDb(){
  if(mongoose.connection.readyState!==1) await connectDb();
  return mongoose.connection.db.admin().ping();
}
