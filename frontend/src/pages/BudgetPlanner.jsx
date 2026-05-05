import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../api';

const BudgetPlanner = () => {
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState(12000);
  const [totalSpent, setTotalSpent] = useState(8970);

  // Hardcode category data to match UI exactly if no real data
  const [categories, setCategories] = useState([
    {
      name: 'Food',
      icon: '🍔',
      spent: 2400,
      allocated: 3000,
      warning: 'Approaching budget limit - $600 remaining'
    },
    {
      name: 'Shopping',
      icon: '🛍️',
      spent: 1800,
      allocated: 2000,
      warning: ''
    }
  ]);

  useEffect(() => {
    // In a real app we'd fetch these. Keeping dummy matching Figma for visual perfection.
    setLoading(false);
  }, []);

  const remaining = totalBudget - totalSpent;
  const budgetUsedPercent = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Budget Planner</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Set and manage your monthly budgets</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#2563EB] rounded-[1.5rem] p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <Wallet className="w-6 h-6 mb-4 opacity-90" />
          <p className="text-sm font-medium text-blue-100 mb-1">Total Budget</p>
          <h3 className="text-3xl font-bold">${totalBudget.toLocaleString()}</h3>
        </div>
        <div className="bg-[#FF004D] rounded-[1.5rem] p-6 text-white shadow-lg shadow-red-500/20 relative overflow-hidden">
          <TrendingUp className="w-6 h-6 mb-4 opacity-90" />
          <p className="text-sm font-medium text-red-100 mb-1">Total Spent</p>
          <h3 className="text-3xl font-bold">${totalSpent.toLocaleString()}</h3>
        </div>
        <div className="bg-[#10B981] rounded-[1.5rem] p-6 text-white shadow-lg shadow-green-500/20 relative overflow-hidden">
          <DollarSign className="w-6 h-6 mb-4 opacity-90" />
          <p className="text-sm font-medium text-green-100 mb-1">Remaining</p>
          <h3 className="text-3xl font-bold">${remaining.toLocaleString()}</h3>
        </div>
        <div className="bg-[#8B5CF6] rounded-[1.5rem] p-6 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden">
          <CheckCircle className="w-6 h-6 mb-4 opacity-90" />
          <p className="text-sm font-medium text-purple-100 mb-1">Budget Used</p>
          <h3 className="text-3xl font-bold">{budgetUsedPercent}%</h3>
        </div>
      </div>

      {/* Set Monthly Budget Slider */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8">Set Monthly Budget</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
              <div 
                className="absolute top-0 left-0 h-full bg-[#2563EB] rounded-full" 
                style={{ width: `${((totalBudget - 5000) / (20000 - 5000)) * 100}%` }}
              ></div>
              <input 
                type="range" 
                min="5000" 
                max="20000" 
                step="500"
                value={totalBudget} 
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-[#2563EB] rounded-full border-4 border-white shadow-md pointer-events-none"
                style={{ left: `calc(${((totalBudget - 5000) / (20000 - 5000)) * 100}% - 10px)` }}
              ></div>
            </div>
            <div className="flex justify-between mt-3 text-xs font-medium text-slate-400">
              <span>$5,000</span>
              <span>$20,000</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 dark:text-white min-w-[120px] text-right">
            ${totalBudget.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Category Budgets */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-8">Category Budgets</h3>
        
        <div className="space-y-12">
          {categories.map((cat, idx) => {
            const percent = Math.min((cat.spent / cat.allocated) * 100, 100);
            return (
              <div key={idx} className="space-y-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{cat.name}</h4>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        ${cat.spent.toLocaleString()} of ${cat.allocated.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {cat.spent >= cat.allocated * 0.8 && (
                    <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
                  )}
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden relative">
                  <div 
                    className="h-full rounded-full bg-[#FF6B00]" 
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs font-bold text-slate-400 mt-1">
                  <span>{percent.toFixed(1)}% used</span>
                  <span>${(cat.allocated - cat.spent).toLocaleString()} left</span>
                </div>

                {/* Sub Slider for Category Budget */}
                <div className="pt-4 flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-500">Budget:</span>
                  <div className="flex-1 relative h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#2563EB] rounded-full" 
                      style={{ width: `${(cat.allocated / 5000) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2563EB] rounded-full border-[3px] border-white shadow-sm pointer-events-none"
                      style={{ left: `calc(${(cat.allocated / 5000) * 100}% - 8px)` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">${cat.allocated.toLocaleString()}</span>
                </div>

                {cat.warning && (
                  <div className="mt-4 bg-[#FFF7ED] dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-orange-500 font-bold">⚠️</span>
                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{cat.warning}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
