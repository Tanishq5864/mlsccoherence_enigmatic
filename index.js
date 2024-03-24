const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
// const nodemailer = require("nodemailer");


const app = express();
const port = process.env.NODE_PORT;
const cors = require("cors");
app.use(cors());
const http = require("http").createServer(app);
// const io = require("socket.io")(http);


// If you are using Socket.IO v3, you need to explicitly enable Cross-Origin Resource Sharing (CORS).
const io = require("socket.io")(http
  , {
  cors: {
    origin:process.env.NODE_IO_HOST ,
    methods: ["GET", "POST"]
  }
}
);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

mongoose
  .connect(process.env.NODE_MONGOOSE_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log("Server is running on port "+port);
  
});

const User = require("./models/user");
//endpoint to register a user in the backend
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;
    //check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered");
      return res.status(400).json({ message: "Email already registered" });
    }

    //create a new User
    const newUser = new User({
      name,
      email,
      password,
      profileImage,
    });

    
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();

    
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Registration failed" });
  }
});


const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

//endpoint to login a user.
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body)
    //check if user exists already
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //check if password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    console.log(token)
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

//user's profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile" });
  }
});


