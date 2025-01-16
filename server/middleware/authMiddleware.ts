import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user property
interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// Ensure JWT_SECRET exists
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ msg: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { user: { id: string } };
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Error in authMiddleware:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default authMiddleware;
