// src/scripts/test-db-connection.ts
import dbConnect from '@/lib/dbConnect';
import { Collection } from 'mongodb';



async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const mongoose = await dbConnect();
    console.log('Successfully connected to MongoDB!');
    
    // List all collections in the database
    const collections = await mongoose.connection.db.collections();
    console.log('Collections in database:');
    collections.forEach((collection: Collection) => {
        console.log(`- ${collection.collectionName}`);
      });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

testConnection();