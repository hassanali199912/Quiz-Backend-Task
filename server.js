require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors");

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors());

// Main Router
const mainRouter = require("./routes/index");
app.use("/api", mainRouter);
app.use("/test", (req, res) => {
  res.status(200).json({
    message: "It Works ❤️❤️👍",
    status: 200,
    authorizer: {
      name: "Hassan Ali Hassan",
      email: "hassanalihassan1203@gmail.com",
      github: "https://github.com/hassanali199912",
    },
  });
});

// MongoDB Connection And Start Server

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log(err));
