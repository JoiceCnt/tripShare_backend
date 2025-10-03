// Backend/routes/route.destination.js
import express from "express";
import axios from "axios";

const router = express.Router();

// GET all countries
router.get("/countries", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.countrystatecity.in/v1/countries",
      {
        headers: { "X-CSCAPI-KEY": process.env.CSC_API_KEY },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all cities by country code
router.get("/countries/:countryCode/cities", async (req, res) => {
  try {
    const { countryCode } = req.params;
    const response = await axios.get(
      `https://api.countrystatecity.in/v1/countries/${countryCode}/cities`,
      {
        headers: { "X-CSCAPI-KEY": process.env.CSC_API_KEY },
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;