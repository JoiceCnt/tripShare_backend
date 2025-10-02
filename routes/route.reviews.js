import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new review
router.post("/", async (req, res) => {
  try {
    const { country, text } = req.body;

    if (!country || !text) {
      return res.status(400).json({ error: "Country and text are required" });
    }

    const newReview = await Review.create({ country, text });
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
