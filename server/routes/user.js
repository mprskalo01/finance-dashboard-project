import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import accountController from "../controllers/accountController.js";

const router = express.Router();

// Get all users (admin only)
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      username,
      name,
      email,
      password,
    });

    // // Hash password, redudant hashing is done in the model
    // const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);

    // Create account for the user and assign
    await accountController.initializeAccountAndTransactions(user._id);

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
          token, // JWT token
          user: {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin, // Include isAdmin
          },
        });
      }
    );
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create and return JWT
    const payload = {
      user: {
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
          // other user properties
        },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Get current user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// router.get("/profile", (req, res) => {
//   try {
//     const randomString = Math.random().toString(36).substring(7);
//     res.json({ randomString }); // Ensure the key is "randomString"
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching random string", error: error.message });
//   }
// });

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

// Admin: Update user
router.put(
  "/admin/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { username, email, isAdmin } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (username) user.username = username;
      if (email) user.email = email;
      if (isAdmin !== undefined) user.isAdmin = isAdmin;

      await user.save();
      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }
);

// Admin: Delete user
router.delete(
  "/admin/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.remove();
      res.json({ message: "User removed" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting user", error: error.message });
    }
  }
);

export default router;
