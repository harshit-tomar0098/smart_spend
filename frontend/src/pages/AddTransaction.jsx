import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    category: 'Food',
    merchant: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      navigate('/history');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          <PlusCircle className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Add Transaction</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-500">$</span>
                <input 
                  type="number"
                  required
                  step="0.01"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Food">Food</option>
                <option value="Shopping">Shopping</option>
                <option value="Travel">Travel</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
              <input 
                type="date"
                required
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Merchant / Description</label>
            <input 
              type="text"
              required
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
              placeholder="e.g. Walmart, Salary"
              value={formData.merchant}
              onChange={e => setFormData({...formData, merchant: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
