import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Request, Response } from 'express';
import User from '../models/User';
import accountController from './accountController';
import Product from '../models/Product';
import Account from '../models/Account';

interface User {
  id: string;
  email: string;
  isAdmin: string;
  password: string;
}

interface UserRequest extends Request {
  user?: {
    id: string;
    password: string;
    email: string;
    isAdmin: boolean;
  };
}

// Utility type for JWT payload
interface JWTPayload {
  user: {
    id: string;
    email: string;
    isAdmin: boolean;
  };
}

// Register a new user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
    }: { name: string; email: string; password: string } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ msg: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    await user.save();

    // Initialize account for the new user
    await accountController.initializeAccountAndTransactions(user.id);

    const payload: JWTPayload = {
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    jwt.sign(
      payload,
      secret,
      { expiresIn: '1h' },
      (err: Error | null, token: string | undefined) => {
        if (err || !token) {
          res.status(500).send('Failed to generate token');
          return;
        }

        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Login user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ msg: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      res.status(400).json({ msg: 'Invalid credentials' });
      return;
    }

    const payload: JWTPayload = {
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    jwt.sign(
      payload,
      secret,
      { expiresIn: '1h' },
      (err: Error | null, token: string | undefined) => {
        if (err || !token) {
          res.status(500).send('Failed to generate token');
          return;
        }

        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
          },
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get current user profile
export const getUserProfile = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update user profile
export const updateUserProfile = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email }: { name?: string; email?: string } = req.body;
    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(500)
        .json({ message: 'Error updating profile', error: err.message });
    }
  }
};

// Admin: Get all users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send('Server error');
  }
};

// Admin: Update user
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      isAdmin,
    }: { name?: string; email?: string; isAdmin?: boolean } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user',
      error: (error as Error).message,
    });
  }
};

// Admin: Delete user
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }

    await Product.deleteMany({ userId: req.params.id }, { session });
    await Account.deleteOne({ userId: req.params.id }, { session });
    await User.deleteOne({ _id: req.params.id }, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ msg: 'User and associated data deleted successfully' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error((err as Error).message);
    res.status(500).send('Server error');
  }
};

// User: Delete own account
export const deleteSelf = async (
  req: UserRequest,
  res: Response
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = (req.user as { id: string }).id;

    await Product.deleteMany({ userId }, { session });
    await Account.deleteOne({ userId }, { session });
    await User.deleteOne({ _id: userId }, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ msg: 'User and associated data deleted successfully' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error((err as Error).message);
    res.status(500).send('Server error');
  }
};
