import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import "dotenv/config";

// Importa as rotas
import authRoutes from "./routes/route.auth.js";
import destinationRoutes from "./routes/route.destination.js";
import reviewRoutes from "./routes/route.reviews.js";
import favouritesRouter from "./routes/favourites.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5005;
console.log("Cloudinary Key:", process.env.CLOUDINARY_API_KEY);
// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favourites", favouritesRouter);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log("server running on port " + PORT));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));
