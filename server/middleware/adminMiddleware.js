import User from "../models/User.js"; // Adjust the import path as needed

const adminMiddleware = async (req, res, next) => {
  try {
    // The user object should be attached to the request by the authMiddleware
    if (!req.user) {
      return res.status(401).json({ msg: "Authentication required" });
    }

    // Fetch the user from the database to get the most up-to-date information
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ msg: "Access denied. Admin privileges required" });
    }

    // If the user is an admin, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error("Error in adminMiddleware:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export default adminMiddleware;
