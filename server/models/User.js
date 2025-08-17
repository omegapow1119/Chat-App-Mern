import mongoose from "mongoose";

// mongoose connection

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    bio: { type: String },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
