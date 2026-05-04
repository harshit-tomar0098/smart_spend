const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me_in_prod';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.use(authenticateToken);

// Get budgets for the current month
router.get('/', async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    // Get all budgets for user for this month
    const budgets = await prisma.budget.findMany({
      where: { 
        user_id: req.user.userId,
        month: currentMonth
      }
    });

    // We also need to calculate spent amount per category
    // Start and end of the current month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: req.user.userId,
        type: 'EXPENSE',
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    });

    // Group transactions by category
    const spentByCategory = {};
    transactions.forEach(tx => {
      if (!spentByCategory[tx.category]) spentByCategory[tx.category] = 0;
      spentByCategory[tx.category] += tx.amount;
    });

    // Colors mapping to make it look nice
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];

    const enrichedBudgets = budgets.map((b, index) => {
      const spent = spentByCategory[b.category] || 0;
      return {
        id: b.id,
        category: b.category,
        allocated: b.limit_amount,
        spent: spent,
        overbudget: spent > b.limit_amount,
        color: colors[index % colors.length]
      };
    });

    // Savings goal heuristic (just a static sample for now until we build goals)
    const savingsGoal = {
      name: 'Vacation Fund',
      target: 5000,
      saved: 2400
    };

    res.json({ budgets: enrichedBudgets, savingsGoal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Create or update budget
router.post('/', async (req, res) => {
  try {
    const { category, limit_amount } = req.body;
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    // Check if budget exists for this month and category
    const existing = await prisma.budget.findFirst({
      where: {
        user_id: req.user.userId,
        category,
        month: currentMonth
      }
    });

    if (existing) {
      const updated = await prisma.budget.update({
        where: { id: existing.id },
        data: { limit_amount: parseFloat(limit_amount) }
      });
      return res.json(updated);
    }

    const budget = await prisma.budget.create({
      data: {
        user_id: req.user.userId,
        category,
        limit_amount: parseFloat(limit_amount),
        month: currentMonth
      }
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

module.exports = router;
