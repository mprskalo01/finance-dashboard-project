import express from 'express';
import accountController from '../controllers/accountController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Get user's account
router.get('/account', authMiddleware, accountController.getUserAccount);

// Update user's account
router.put('/account', authMiddleware, accountController.updateAccount);

// Add transaction to user's account
router.post('/transaction', authMiddleware, accountController.addTransaction);

// Update a specific transaction
router.put(
  '/transaction/:id',
  authMiddleware,
  accountController.updateTransaction
);

// Delete a specific transaction
router.delete(
  '/transaction/:id',
  authMiddleware,
  accountController.deleteTransaction
);

// Get user's transactions
router.get(
  '/transactions',
  authMiddleware,
  accountController.getUserTransactions
);

// Get account statistics
router.get('/stats', authMiddleware, accountController.getAccountStats);

// Edit monthly data
router.patch('/edit', authMiddleware, accountController.editMonthlyData);

export default router;
