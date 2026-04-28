import React from 'react';
import { Target, AlertTriangle, Plus } from 'lucide-react';

const budgetData = [
  { category: 'Housing', allocated: 2000, spent: 2000, color: 'bg-blue-500' },
  { category: 'Food', allocated: 800, spent: 650, color: 'bg-green-500' },
  { category: 'Transportation', allocated: 400, spent: 380, color: 'bg-purple-500' },
  { category: 'Entertainment', allocated: 300, spent: 350, color: 'bg-red-500', overbudget: true },
  { category: 'Utilities', allocated: 250, spent: 200, color: 'bg-yellow-500' },
];

const BudgetPlanner = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Budget Planner</h2>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-md shadow-blue-500/30 hover:opacity-90 transition-opacity font-medium text-sm">
          <Plus className="w-4 h-4" /> Create Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Monthly Budgets</h3>
          <div className="space-y-6">
            {budgetData.map((b, idx) => {
              const percent = Math.min((b.spent / b.allocated) * 100, 100);
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                      {b.category}
                      {b.overbudget && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      ${b.spent} / ${b.allocated}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full ${b.overbudget ? 'bg-red-500' : b.color}`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{percent.toFixed(0)}% used</span>
                    {b.overbudget ? (
                      <span className="text-red-500 font-medium">${b.spent - b.allocated} over budget</span>
                    ) : (
                      <span className="text-green-500 font-medium">${b.allocated - b.spent} remaining</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden h-[fit-content]">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-16 -mt-16"></div>
           <div className="relative z-10 flex items-center gap-2 mb-6">
             <Target className="w-6 h-6" />
             <h3 className="text-lg font-semibold">Savings Goal</h3>
           </div>
           
           <div className="text-center relative z-10 space-y-4">
             <p className="text-blue-100 text-sm">Vacation Fund</p>
             <h2 className="text-4xl font-bold">$2,400</h2>
             <p className="text-blue-100 text-sm">of $5,000 target</p>
             
             <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden mt-6">
               <div className="h-3 rounded-full bg-white" style={{ width: '48%' }}></div>
             </div>
             <p className="text-sm font-medium mt-2">48% Achieved</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
