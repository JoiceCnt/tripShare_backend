import express from "express";
import Favourite from "../models/Favourite.js";
import Review from "../models/Review.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// GET favoritos del usuario
router.get("/", isAuth, async (req, res) => {
  try {
    const favourites = await Favourite.find({ user: req.user._id }).populate({
      path: "review",
      populate: { path: "user", select: "name surname email" },
    });
    const result = favourites
      .filter((f) => f.review)
      .map((f) => ({
        _id: f.review._id,
        city: f.review.city,
        text: f.review.text,
        imageUrl: f.review.imageUrl,
        user: f.review.user,
        ratings: f.review.ratings,
      }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST añadir o quitar favorito
router.post("/:reviewId", isAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const existing = await Favourite.findOne({
      user: req.user._id,
      review: reviewId,
    });

    if (existing) {
      // si ya existe, lo eliminamos (toggle)
      await existing.deleteOne();
      return res.json({ message: "Removed from favourites" });
    }

    const newFav = await Favourite.create({
      user: req.user._id,
      review: reviewId,
    });

    const populated = await newFav.populate({
      path: "review",
      populate: { path: "user", select: "name surname email" },
    });

    res.status(201).json(populated.review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
