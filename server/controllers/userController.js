const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming you have a User model
const auth = require("../middleware/auth"); // Middleware for authentication
const admin = require("../middleware/admin"); // Middleware for admin check

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user
    user = new User({
      username,
      name,
      email,
      password,
      // You might want to set default values here for fields like isAdmin
      isAdmin: false, // or based on your logic
    });

    // Save user
    await user.save();

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin, // Assuming isAdmin exists in your User schema
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        // Send both token and user data in the response
        res.json({
          token: token,
          user: {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
            // other user properties
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    if (user && user.validatePassword(password)) {
      const token = generateToken(user); // generate JWT token
      res.json({
        token: token,
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
          // include other user properties as needed
        },
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin, // Assuming isAdmin exists in your User schema
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        // Send both token and user data in the response
        res.json({
          token: token,
          user: {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
            // other user properties
          },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get current user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Admin: Get all users
router.get("/admin/users", [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Admin: Update user
router.put("/admin/users/:id", [auth, admin], async (req, res) => {
  try {
    const { username, email, isAdmin } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Admin: Delete user
router.delete("/admin/users/:id", [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.remove();
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
