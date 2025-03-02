export default async function dbConnect() {
  // Ensures this function only runs on the server
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const mongoose = await import("mongoose");
    const dotenv = await import("dotenv");
    dotenv.config();

    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/globetrotter";
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    const globalWithMongoose = global;
    globalWithMongoose.mongoose = globalWithMongoose.mongoose || {
      conn: null,
      promise: null,
    };

    if (globalWithMongoose.mongoose.conn) {
      return globalWithMongoose.mongoose.conn;
    }

    if (!globalWithMongoose.mongoose.promise) {
      globalWithMongoose.mongoose.promise = mongoose
        .connect(MONGODB_URI)
        .then((mongooseInstance) => {
          return mongooseInstance;
        });
    }

    try {
      globalWithMongoose.mongoose.conn = await globalWithMongoose.mongoose
        .promise;
      console.log(">> MongoDB connection successful.");
    } catch (error) {
      globalWithMongoose.mongoose.promise = null;
      console.error("Failed to connect to MongoDB:", error);
      throw new Error(
        "Failed to connect to MongoDB: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }

    return globalWithMongoose.mongoose.conn;
  }
}

(async () => {
  await dbConnect();
})();
