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

// Get all transactions for the user
router.get('/', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { user_id: req.user.userId },
      orderBy: { date: 'desc' },
      include: { account: true }
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add a transaction
router.post('/', async (req, res) => {
  try {
    let { account_id, type, category, amount, date, merchant, notes, is_recurring, tags } = req.body;
    
    // Auto-pick first account if not provided
    if (!account_id) {
      const firstAccount = await prisma.account.findFirst({ where: { user_id: req.user.userId } });
      if (firstAccount) account_id = firstAccount.id;
      else return res.status(400).json({ error: 'No account found for user' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        user_id: req.user.userId,
        account_id,
        type,
        category,
        amount: parseFloat(amount),
        date: new Date(date),
        merchant,
        notes,
        is_recurring: is_recurring || false,
        tags: tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : "[]"
      }
    });

    // Update account balance
    const account = await prisma.account.findUnique({ where: { id: account_id } });
    if (account) {
      const balanceChange = type === 'INCOME' ? parseFloat(amount) : -parseFloat(amount);
      await prisma.account.update({
        where: { id: account_id },
        data: { balance: account.balance + balanceChange }
      });
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

module.exports = router;
