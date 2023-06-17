import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected!🍃");
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default dbConnect;
