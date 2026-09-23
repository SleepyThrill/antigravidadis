const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(customUri) {
  const uri = customUri || process.env.MONGODB_URI;

  if (cached.conn) {
    return cached.conn;
  }

  if (!uri) {
    throw new Error('A variavel de ambiente MONGODB_URI nao foi definida');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

async function disconnectDB() {
  if (cached.conn || mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

module.exports = {
  connectDB,
  disconnectDB,
};
