const mongoose = require('mongoose');

// Vercel serverless: global o'zgaruvchida ulanishni saqlash
// Har bir so'rovda qayta ulanishning oldini oladi
if (!global._mongoConn) {
  global._mongoConn = { conn: null, promise: null };
}

async function connectMongo() {
  if (global._mongoConn.conn && mongoose.connection.readyState === 1) {
    return global._mongoConn.conn;
  }

  if (!global._mongoConn.promise) {
    global._mongoConn.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }).then((m) => {
      console.log('MongoDB ulandi');
      return m;
    }).catch((err) => {
      global._mongoConn.promise = null;
      throw err;
    });
  }

  global._mongoConn.conn = await global._mongoConn.promise;
  return global._mongoConn.conn;
}

module.exports = connectMongo;
