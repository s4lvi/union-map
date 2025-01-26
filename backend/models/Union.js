// backend/models/Union.js
const mongoose = require("mongoose");

const unionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation_name: { type: String },
  designation_number: { type: String },
  unit: { type: String },
  sector: {
    type: String,
    enum: ["Manufacturing", "Agriculture", "Healthcare", "Service", "Other"],
  },
  website: { type: String },
  info: { type: String },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  address: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String },
});

unionSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Union", unionSchema);
