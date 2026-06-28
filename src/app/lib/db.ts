// import mongoose from "mongoose";
// const MONGODB_URI = process.env.MONGODB_URI;

// async function dbConnect() {
//   if (!MONGODB_URI) {
//     throw new Error("Please define the MONGODB_URI environment variable");
//   }
//   await mongoose.connect(MONGODB_URI);
//   return mongoose;
// }

// async function dbDisconnect() {
//   await mongoose.disconnect(MONGODB_URI);
// }

// export { dbConnect, dbDisconnect };

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

