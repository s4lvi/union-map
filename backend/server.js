// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const path = require("path");
const userRoutes = require("./routes/users");
const unionRoutes = require("./routes/unions");
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/unions", unionRoutes);

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "..", "frontend", "build", "index.html")
    );
  });
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
