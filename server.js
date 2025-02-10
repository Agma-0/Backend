require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL,
   ).then(() => console.log("✅ MongoDB Connected"))
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
    const newReview = new Review(req.body);
    await newReview.save();
    res.json({ message: "Review added!" });
});

app.listen(process.env.PORT || 5000, () => console.log("🚀 Server running"));
