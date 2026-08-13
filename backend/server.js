const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect("mongodb://127.0.0.1:27017/wireframeAi")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Model
const User = require("./models/User");

// User Activity Model
const UserActivity = require("./models/UserActivity");

// Admin Model
const Admin = require("./models/Admin");

// Register Route
app.post("/register", async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("❌ Error registering user:", error.message || error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: error.message || "Error registering user" });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check password
        let isMatch = await user.comparePassword(password);
        if (!isMatch && user.password === password) {
            isMatch = true; // Fallback for old plain text passwords
        }

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // If matched
        res.status(200).json({
            message: "Login successful",
            user: { _id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("❌ Error logging in:", error);
        res.status(500).json({ message: "Error logging in" });
    }
});

// Google Auth Route (Login / Register)
app.post("/api/auth/google", async (req, res) => {
    try {
        const { email, name } = req.body;
        
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create user if they don't exist. Generate random password for Google Auth.
            const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
            user = await User.create({ email, name, password: randomPassword });
        }
        
        res.status(200).json({
            message: "Google Auth successful",
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error("❌ Error with Google Auth:", error);
        res.status(500).json({ message: "Error with Google Auth" });
    }
});

// View All Users (optional)
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// --- USER ACTIVITY ROUTES ---

// 1. Save User Activity
app.post("/api/activity", async (req, res) => {
    try {
        const { userId, activityType, prompt, metadata } = req.body;
        
        const newActivity = await UserActivity.create({
            userId,
            activityType,
            prompt,
            metadata
        });

        res.status(201).json({ 
            message: "Activity saved successfully", 
            activity: newActivity 
        });
    } catch (error) {
        console.error("❌ Error saving activity:", error);
        res.status(500).json({ message: "Error saving activity" });
    }
});

// 2. Get User Activity History
app.get("/api/activity/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { type } = req.query;
        
        const query = { userId };
        if (type) query.activityType = type;

        const activities = await UserActivity.find(query)
            .sort({ createdAt: -1 })
            .limit(10); // Newest first, max 10
            
        res.status(200).json(activities);
    } catch (error) {
        console.error("❌ Error fetching activities:", error);
        res.status(500).json({ message: "Error fetching activities" });
    }
});

// --- ADMIN ROUTES ---

// Admin Register
app.post("/api/admin/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });
        
        await Admin.create({ email, password });
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Admin Login
app.post("/api/admin/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        
        let isMatch = false;
        if (admin) {
            isMatch = await admin.comparePassword(password);
            if (!isMatch && admin.password === password) isMatch = true;
        }

        if (!admin || !isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json({ message: "Login successful", admin: { email: admin.email, _id: admin._id } });
    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Admin Forgot Password
app.post("/api/admin/forgot-password", async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        
        admin.password = newPassword;
        await admin.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating admin password:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get All Users for Dashboard
app.get("/api/admin/users", async (req, res) => {
    try {
        const users = await User.find().lean();
        const usersWithCounts = await Promise.all(users.map(async (user) => {
            const count = await UserActivity.countDocuments({ userId: user._id.toString() });
            return { ...user, activityCount: count };
        }));
        res.status(200).json(usersWithCounts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Delete User and their activities
app.delete("/api/admin/users/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        await UserActivity.deleteMany({ userId });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
});

// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});









































