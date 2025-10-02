// Backend/models/Destination.js
import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  description: String,
});

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
