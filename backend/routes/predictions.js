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

// Get predictions chart data
router.get('/', async (req, res) => {
  try {
    const today = new Date();
    
    // For a realistic looking demo, let's look at the past 30 days of expenses
    const startOfData = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 28); // 4 weeks ago
    const endOfData = today;

    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: req.user.userId,
        type: 'EXPENSE',
        date: {
          gte: startOfData,
          lte: endOfData
        }
      },
      orderBy: { date: 'asc' }
    });

    // Group by week (last 4 weeks)
    // Week 1: 28 to 21 days ago
    // Week 2: 21 to 14 days ago
    // Week 3: 14 to 7 days ago
    // Week 4: 7 days ago to today
    
    let weeklySpend = [0, 0, 0, 0];
    
    transactions.forEach(tx => {
      const diffTime = Math.abs(today - new Date(tx.date));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays <= 7) weeklySpend[3] += tx.amount;
      else if (diffDays <= 14) weeklySpend[2] += tx.amount;
      else if (diffDays <= 21) weeklySpend[1] += tx.amount;
      else if (diffDays <= 28) weeklySpend[0] += tx.amount;
    });

    // To make the chart look nice and give "predictions", we will calculate moving average
    // Predicted for week n = Average of past weeks + some heuristic
    const avg = (weeklySpend[0] + weeklySpend[1] + weeklySpend[2]) / 3 || 0;

    const chartData = [
      { name: 'Week 1', actual: weeklySpend[0], predicted: weeklySpend[0] * 1.05 },
      { name: 'Week 2', actual: weeklySpend[1], predicted: weeklySpend[1] * 0.95 },
      { name: 'Week 3', actual: weeklySpend[2], predicted: avg },
      { name: 'Week 4', actual: weeklySpend[3], predicted: (avg + weeklySpend[3]) / 2 }
    ];

    // Total predicted end of month
    // Just a placeholder heuristic based on the weekly spend
    const totalPredicted = chartData.reduce((acc, curr) => acc + curr.predicted, 0);

    res.json({
      chartData,
      totalPredictedMonth: totalPredicted,
      comparisonLastMonth: 250 // Dummy value for the UI "+$250 higher than last month"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// Get suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: req.user.userId,
        type: 'EXPENSE',
        date: { gte: startOfMonth }
      }
    });

    const categories = {};
    transactions.forEach(tx => {
      if (!categories[tx.category]) categories[tx.category] = 0;
      categories[tx.category] += tx.amount;
    });

    const suggestions = [];
    
    // Sort categories by highest spend
    const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    
    if (sortedCategories.length > 0) {
      suggestions.push({
        type: 'warning',
        title: `${sortedCategories[0][0]} Alert`,
        description: `You have spent $${sortedCategories[0][1]} on ${sortedCategories[0][0]} this month. Consider tracking this category closely.`
      });
    }

    if (sortedCategories.length > 1) {
       suggestions.push({
        type: 'success',
        title: 'Savings Opportunity',
        description: `If you reduce your ${sortedCategories[1][0]} by 15%, you could save $${(sortedCategories[1][1] * 0.15).toFixed(2)} this month.`
      });
    }

    if (suggestions.length === 0) {
       suggestions.push({
        type: 'success',
        title: 'Great Job',
        description: 'You are managing your expenses well. Keep tracking to get personalized insights!'
      });
    }

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
});

module.exports = router;
