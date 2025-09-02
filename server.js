require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

