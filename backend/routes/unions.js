const express = require("express");
const router = express.Router();
const Union = require("../models/Union");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const fetch = require("node-fetch");

// @route GET /api/unions
// @desc Get all unions or search with filters
// @access Public
router.get("/", async (req, res) => {
  let { city, state, sector, zip, radius } = req.query;
  let query = {};

  // Default radius to 10 miles
  radius = radius || 10;

  if (sector) {
    query.sector = { $in: sector.split(",") }; // Allow multiple sectors
  }

  if (city) query.city = new RegExp(city, "i");
  if (state) query.state = new RegExp(state, "i");

  if (zip) {
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&postalcode=${zip}&country=us&limit=1`
      );
      const geoData = await geoRes.json();

      if (geoData.length === 0) {
        return res.status(400).json({ message: "Invalid ZIP code." });
      }

      const { lat, lon } = geoData[0];
      query.location = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lon), parseFloat(lat)],
            radius / 3963.2, // Convert miles to radians
          ],
        },
      };
    } catch (err) {
      console.error("Geocoding error:", err);
      return res.status(500).json({ message: "Error processing geocoding." });
    }
  }

  try {
    const unions = await Union.find(query)
      .select("-__v") // Exclude version key
      .lean();
    res.json(unions);
  } catch (err) {
    console.error("Error fetching unions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/unions
// @desc Add a new union
// @access Private (Admin)
router.post("/", auth, admin, async (req, res) => {
  const {
    name,
    designation_name,
    designation_number,
    sector,
    website,
    info,
    city,
    state,
    zip,
    coordinates,
  } = req.body;

  // Validate required fields
  if (!name || !city || !state || !coordinates) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newUnion = new Union({
      name,
      designation_name,
      designation_number,
      sector,
      website,
      info,
      city,
      state,
      zip,
      location: {
        type: "Point",
        coordinates: Array.isArray(coordinates)
          ? coordinates
          : coordinates.split(",").map(Number),
      },
    });

    const union = await newUnion.save();
    res.status(201).json(union);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/unions/:id
// @desc Update a union
// @access Private (Admin)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const union = await Union.findById(req.params.id);
    if (!union) {
      return res.status(404).json({ message: "Union not found" });
    }

    // Update allowed fields
    const updatableFields = [
      "name",
      "designation_name",
      "designation_number",
      "sector",
      "website",
      "info",
      "city",
      "state",
      "zip",
      "coordinates",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "coordinates") {
          union.location.coordinates = Array.isArray(req.body[field])
            ? req.body[field]
            : req.body[field].split(",").map(Number);
        } else {
          union[field] = req.body[field];
        }
      }
    });

    const updatedUnion = await union.save();
    res.json(updatedUnion);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// @route DELETE /api/unions/:id
// @desc Delete a union
// @access Private (Admin)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const union = await Union.findByIdAndDelete(req.params.id);
    if (!union) {
      return res.status(404).json({ message: "Union not found" });
    }
    res.json({ message: "Union removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
