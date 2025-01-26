const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const axios = require("axios");
const path = require("path");

// Import your Union model (adjust path as needed)
const Union = require("./Union");

// Geolocation cache
const GEO_CACHE_FILE = "geocode-cache.json";
let geocodeCache = {};

// Load existing cache
if (fs.existsSync(GEO_CACHE_FILE)) {
  geocodeCache = JSON.parse(fs.readFileSync(GEO_CACHE_FILE));
}

// MongoDB connection
mongoose.connect(
  "mongodb+srv://jordansalvi:ct5yy5uv2OvcKZf4@union-map-cluster.xuev2.mongodb.net/?retryWrites=true&w=majority&appName=union-map-cluster",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

async function geocode(city, state) {
  const cacheKey = `${city.toLowerCase()}_${state.toLowerCase()}`;

  // Return cached coordinates if available
  if (geocodeCache[cacheKey]) {
    return geocodeCache[cacheKey];
  }

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          city: city,
          state: state,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "UnionMapUploader/1.0 (your@email.com)", // Set your app name/email
        },
      }
    );

    if (response.data.length > 0) {
      const result = response.data[0];
      const coords = [parseFloat(result.lon), parseFloat(result.lat)];

      // Update cache
      geocodeCache[cacheKey] = coords;
      fs.writeFileSync(GEO_CACHE_FILE, JSON.stringify(geocodeCache));

      return coords;
    }
  } catch (error) {
    console.error(`Geocoding error for ${city}, ${state}:`, error.message);
  }
  return null;
}

async function processCSV(filePath) {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

async function main() {
  const csvFilePath = "DOL-Unions.csv"; // Pass CSV path as argument

  if (!csvFilePath) {
    console.error("Please provide a CSV file path");
    process.exit(1);
  }

  try {
    const records = await processCSV(csvFilePath);

    for (const record of records) {
      const city = record.City.trim();
      const state = record.State.trim();

      const coordinates = await geocode(city, state);

      if (!coordinates) {
        console.warn(`Skipping ${record["Union Name"]} - could not geocode`);
        continue;
      }

      const unionData = {
        name: record["Union Name"],
        designation_name: record["Designation Name"],
        designation_number: record["Designation Number"],
        info: record.Unit || undefined,
        city: city,
        state: state,
        location: {
          type: "Point",
          coordinates: coordinates,
        },
      };

      // Create and save union
      const union = new Union(unionData);
      await union.save();
      console.log(`Saved union: ${union.name}`);
    }

    console.log("Upload complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

main();
