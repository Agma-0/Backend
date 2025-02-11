require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json()); // Allows Express to parse JSON requests
app.use(cors({
    origin: "*", // Allow all origins (Frontend can connect)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Review Schema (Now Includes CID)
const ReviewSchema = new mongoose.Schema({
    name: String,
    cid: String, // Added CID field
    review: String,
    service: Number,
    food: Number,
    ambience: Number,
    atmosphere: Number,
});
const Review = mongoose.model("Review", ReviewSchema);

// ✅ POST API: Save a Review
app.post("/api/reviews", async (req, res) => {
    try {
        console.log("📝 Incoming Data:", req.body); // Debugging

        const { name, cid, review, service, food, ambience, atmosphere } = req.body;

        if (!name || !cid || !review || service === undefined || food === undefined || ambience === undefined || atmosphere === undefined) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newReview = new Review({ name, cid, review, service, food, ambience, atmosphere });
        await newReview.save();

        console.log("✅ Review Saved:", newReview);
        res.status(201).json({ message: "Review added successfully!" });
    } catch (error) {
        console.error("❌ Error saving review:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ GET API: Fetch All Reviews (Including CID)
app.get("/api/reviews", async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        console.error("❌ Error fetching reviews:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

