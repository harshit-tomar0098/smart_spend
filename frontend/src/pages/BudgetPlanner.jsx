import React, { useState, useEffect } from 'react';
import { Target, AlertTriangle, Plus, X } from 'lucide-react';
import api from '../api';

const BudgetPlanner = () => {
  const [budgetData, setBudgetData] = useState([]);
  const [savingsGoal, setSavingsGoal] = useState({ name: 'Savings', target: 0, saved: 0 });
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ category: 'Food', limit_amount: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const { data } = await api.get('/budgets');
      setBudgetData(data.budgets || []);
      if (data.savingsGoal) {
        setSavingsGoal(data.savingsGoal);
      }
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/budgets', {
        category: formData.category,
        limit_amount: parseFloat(formData.limit_amount)
      });
      setShowModal(false);
      setFormData({ category: 'Food', limit_amount: '' });
      fetchBudgets(); // Refresh the list
    } catch (err) {
      console.error('Failed to create budget', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Budget Planner</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-md shadow-blue-500/30 hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Create Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Monthly Budgets</h3>
          
          {loading ? (
             <div className="text-slate-500 text-center py-8">Loading budgets...</div>
          ) : budgetData.length === 0 ? (
             <div className="text-slate-500 text-center py-8">No budgets set. Create one!</div>
          ) : (
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
                        ${b.spent.toFixed(2)} / ${b.allocated.toFixed(2)}
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
                        <span className="text-red-500 font-medium">${(b.spent - b.allocated).toFixed(2)} over budget</span>
                      ) : (
                        <span className="text-green-500 font-medium">${(b.allocated - b.spent).toFixed(2)} remaining</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden h-[fit-content]">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-16 -mt-16"></div>
           <div className="relative z-10 flex items-center gap-2 mb-6">
             <Target className="w-6 h-6" />
             <h3 className="text-lg font-semibold">Savings Goal</h3>
           </div>
           
           <div className="text-center relative z-10 space-y-4">
             <p className="text-blue-100 text-sm">{savingsGoal.name}</p>
             <h2 className="text-4xl font-bold">${savingsGoal.saved.toLocaleString()}</h2>
             <p className="text-blue-100 text-sm">of ${savingsGoal.target.toLocaleString()} target</p>
             
             {savingsGoal.target > 0 && (
               <>
                 <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden mt-6">
                   <div className="h-3 rounded-full bg-white" style={{ width: `${Math.min((savingsGoal.saved / savingsGoal.target) * 100, 100)}%` }}></div>
                 </div>
                 <p className="text-sm font-medium mt-2">{((savingsGoal.saved / savingsGoal.target) * 100).toFixed(0)}% Achieved</p>
               </>
             )}
           </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Create Budget Limit</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBudget} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Housing">Housing</option>
                  <option value="Food">Food</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Travel">Travel</option>
                  <option value="Bills">Bills</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Limit ($)</label>
                <input 
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g. 500"
                  value={formData.limit_amount}
                  onChange={e => setFormData({...formData, limit_amount: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:opacity-90 transition-opacity mt-4"
              >
                {saving ? 'Saving...' : 'Save Budget'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPlanner;
