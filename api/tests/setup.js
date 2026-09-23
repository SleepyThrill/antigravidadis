const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDB, disconnectDB } = require('../src/config/db');
const mongoose = require('mongoose');

let mongoServer;

async function startTestDB() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  await connectDB(uri);
  return uri;
}

async function stopTestDB() {
  await disconnectDB();
  if (mongoServer) {
    await mongoServer.stop();
  }
}

async function clearTestDB() {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
}

module.exports = {
  startTestDB,
  stopTestDB,
  clearTestDB,
};
