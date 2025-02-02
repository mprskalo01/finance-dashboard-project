import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import adminMiddleware from '../middleware/adminMiddleware';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  deleteSelf,
} from '../controllers/userController';

const router = express.Router();

// Get all users (admin only)
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get current user profile
router.get('/profile', authMiddleware, getUserProfile);

// Update user profile
router.put('/profile', authMiddleware, updateUserProfile);

// Admin: Update user
router.put('/admin/users/:id', authMiddleware, adminMiddleware, updateUser);

// Admin: Delete user
router.delete('/admin/users/:id', authMiddleware, adminMiddleware, deleteUser);

// User: Delete own account
router.delete('/profile', authMiddleware, deleteSelf);

export default router;
