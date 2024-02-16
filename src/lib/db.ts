import mongoose from "mongoose";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectToDB() {
  if (cached.conn) {
    console.log("Cached mongoDB connection used.");
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    const mongo_uri = process.env.MONGODB_URI;
    if (!mongo_uri) {
      throw new Error("MongoDB URI is not defined!");
    }
    cached.promise = await mongoose.connect(mongo_uri);
    console.log("Connected to mongoDB!");
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;
export { connectToDB };
