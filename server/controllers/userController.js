import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// Signup a new user
export const signup = async (req, res) => {

    try {
        const { name, email, password, bio } = req.body;

        if (!name || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.json({ success: false, message: "Account already exists" });
        }
        // Continue with signup logic here...
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            bio
        });
        await newUser.save();
        const token = generateToken(newUser._id);

        res.json({ success: true, userData: newUser, message: "Account created successfully", token });
    }

    catch (error) {
        console.log(error.message);
        
        return res.json({ success: false, message: error.message });
    }
}

//controller for user login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const userData = await User.findOne({ email });

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(userData._id);

        res.json({ success: true, userData: userData, message: "Login successful", token });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
};


//controller to check if user is authenticated
export const checkAuth = (req, res) => {
    res.json({
        success: true,
        user: req.user,
        message: "User is authenticated"
    });
};


// Controller to update user profile details
export const updateProfile = async (req, res) => {
    try {
        const { name, bio, profilePic } = req.body;

        const userId = req.user.id;

        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId,
                { name, bio, },
                { new: true }
            );
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: upload.secure_url, name, bio },
                { new: true }
            );
        }

        res.json({ success: true, user: updatedUser, message: "Profile updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};