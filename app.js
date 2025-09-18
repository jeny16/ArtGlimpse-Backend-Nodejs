const express = require("express");
const cors = require("cors");
const path = require("path"); // Add this to handle the path
const httpStatus = require("http-status");

// const ApiError = require('./utils/ApiError');

// Import route handlers
const routes = require("./routes/index");
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://art-glimpse-frontend-nodejs.vercel.app',
  'https://art-glimpse-seller-node-js-99tm.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // browser calls from “null” origin on local files—allow that too if needed
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
    
app.use("/api/", routes);

module.exports = app;
