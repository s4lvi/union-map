// backend/routes/unions.js
const express = require("express");
const router = express.Router();
const Union = require("../models/Union");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// @route GET /api/unions
// @desc Get all unions or search with filters
// @access Public
router.get("/", async (req, res) => {
  let { zip, city, type, radius } = req.query;
  let query = {};

  if (!radius) {
    radius = 10;
  }

  if (type) {
    query.type = type;
  }

  if (city) {
    query.city = city;
  }

  if (zip) {
    try {
      // Geocode the ZIP code to get coordinates
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&postalcode=${zip}&country=us&limit=1`
      );
      const geoData = await geoRes.json();

      if (geoData.length === 0) {
        return res.status(400).json({ message: "Invalid ZIP code." });
      }

      const { lat, lon } = geoData[0];

      // Add geospatial query to find unions within the radius
      query.location = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lon), parseFloat(lat)],
            parseFloat(radius) / 3963.2, // Convert miles to radians
          ],
        },
      };
    } catch (err) {
      console.error("Geocoding error:", err);
      return res.status(500).json({ message: "Error processing geocoding." });
    }
  }

  console.log("Constructed Query:", query);

  try {
    const unions = await Union.find(query);
    console.log(`Found ${unions.length} unions matching the criteria.`);
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
  const { name, type, site, info, city, state, zip, coordinates } = req.body;
  try {
    const newUnion = new Union({
      name,
      type,
      site,
      info,
      city,
      state,
      zip,
      location: {
        type: "Point",
        coordinates, // [longitude, latitude]
      },
    });
    const union = await newUnion.save();
    res.status(201).json(union);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/unions/:id
// @desc Update a union
// @access Private (Admin)
router.put("/:id", auth, admin, async (req, res) => {
  const { name, type, site, info, city, state, zip, coordinates } = req.body;
  try {
    let union = await Union.findById(req.params.id);
    if (!union) {
      return res.status(404).json({ message: "Union not found" });
    }
    union.name = name || union.name;
    union.type = type || union.type;
    union.site = site || union.site;
    union.info = info || union.info;
    union.city = city || union.city;
    union.state = state || union.state;
    union.zip = zip || union.zip;
    if (coordinates) {
      union.location = {
        type: "Point",
        coordinates,
      };
    }
    union = await union.save();
    res.json(union);
  } catch (err) {
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
    res.json({ message: "Union removed" });
  } catch (err) {
    console.error(err); // Use console.error for error logging
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
