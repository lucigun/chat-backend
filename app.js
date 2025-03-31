const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Check for required environment variable
if (!process.env.DB) {
  console.error("Please set the DB environment variable.");
  process.exit(1);
}

// Database connection
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(process.env.DB);
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

app.get('/', (req, res) => { res.send('hello open'); });

module.exports = app;
