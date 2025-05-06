// src/lib/dbConnect.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://21040452:apcJib3Ud5y3JU7w@professorsanjeev.hcvkodj.mongodb.net/?retryWrites=true&w=majority&appName=ProfessorSanjeev';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
  var mongoose: {
    conn: any;
    promise: Promise<any> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return {
      conn: cached.conn,
      db: cached.conn.connection.db
    };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  
  cached.conn = await cached.promise;
  return {
    conn: cached.conn,
    db: cached.conn.connection.db
  };
}

export default dbConnect;