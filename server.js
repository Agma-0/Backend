require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Review Schema
const ReviewSchema = new mongoose.Schema({
    name: String,
    review: String,
    service: Number,
    food: Number,
    ambience: Number,
    atmosphere: Number,
});
const Review = mongoose.model("Review", ReviewSchema);

// API Routes
app.get("/api/reviews", async (req, res) => {
    const reviews = await Review.find();
    res.json(reviews);
});

app.post("/api/reviews", async (req, res) => {
    try {
        const { name, review, service, food, ambience, atmosphere } = req.body;

        if (!name || !review || service === undefined || food === undefined || ambience === undefined || atmosphere === undefined) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newReview = new Review({ name, review, service, food, ambience, atmosphere });
        await newReview.save();

        res.status(201).json({ message: "Review added successfully!" });
    } catch (error) {
        console.error("Error saving review:", error);
        res.status(500).json({ error: "Server error" });
    }
});


app.listen(process.env.PORT || 5000, () => console.log("🚀 Server running"));
