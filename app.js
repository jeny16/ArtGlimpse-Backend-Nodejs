const express = require("express");
const cors = require("cors");
const path = require("path"); // Add this to handle the path
const httpStatus = require("http-status");

// const ApiError = require('./utils/ApiError');

// Import route handlers
const routes = require("./routes/index");
const app = express();

app.use(cors());
app.use(express.json());
    
app.use("/api/", routes);

module.exports = app;
