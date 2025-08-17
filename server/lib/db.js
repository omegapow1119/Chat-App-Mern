 import mongoose from "mongoose";

 //mongoose connection

 export const connectDB = async () => {
    try{
        mongoose.connection.on('connected',() => console.log("database connected"));

        await mongoose.connect(`${process.env.MONGODB_URL}/chat-app`);

    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
 }