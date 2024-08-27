const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

// Connect to MongoDB
mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.hioo2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  }
).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
});

// Define schema and model
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Registration.findOne({ email: email });
    if (!existingUser) {
      const registrationData = new Registration({
        name,
        email,
        password,
      });
      await registrationData.save();
      res.redirect("/success");
    } else {
      console.log("User already exists");
      res.redirect("/error");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.redirect("/error");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
