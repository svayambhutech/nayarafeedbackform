// server.js
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// MongoDB Schema
const feedbackSchema = new mongoose.Schema({
  responses: Array,
  additionalFeedback: String,
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// Express Route for Submitting Feedback
app.post("/submit-feedback", async (req, res) => {
  try {
    const { responses, additionalFeedback } = req.body;
    // Save feedback to MongoDB
    const feedback = new Feedback({ responses, additionalFeedback });
    await feedback.save();
    // Respond with a success status
    res.status(201).send("Feedback submitted successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
