// backend/models/Union.js
const mongoose = require("mongoose");

const unionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  sector: {
    type: String,
    enum: ["Manufacturing", "Agriculture", "Healthcare", "Service", "Other"],
  },
  association: { type: String },
  site: { type: String },
  info: { type: String },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String },
});

unionSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Union", unionSchema);
