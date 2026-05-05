import React, { useState } from 'react';
import { Mic, Tag, Calendar, CreditCard, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    category: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    notes: ''
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
        amount: parseFloat(formData.amount),
        category: formData.category || 'Others',
      });
      navigate('/history');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Add Transaction</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Record your income or expense transaction</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Toggle Type */}
          <div className="flex gap-4 p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'EXPENSE'})}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                formData.type === 'EXPENSE' 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'INCOME'})}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                formData.type === 'INCOME' 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Amount *</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">$</span>
              <input 
                type="number"
                required
                step="0.01"
                className="w-full bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-4 text-slate-800 dark:text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                placeholder="0.00"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Category *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Tag className="w-5 h-5" />
              </span>
              <select 
                className="w-full bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-slate-600 dark:text-slate-300 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="" disabled>Select a category</option>
                <option value="Food">Food</option>
                <option value="Shopping">Shopping</option>
                <option value="Travel">Travel</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Date *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Calendar className="w-5 h-5" />
              </span>
              <input 
                type="date"
                required
                className="w-full bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Payment Method *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <CreditCard className="w-5 h-5" />
              </span>
              <select 
                className="w-full bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-slate-600 dark:text-slate-300 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                value={formData.paymentMethod}
                onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                required
              >
                <option value="" disabled>Select payment method</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Notes (Optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-4 text-slate-400">
                <FileText className="w-5 h-5" />
              </span>
              <textarea 
                className="w-full bg-slate-50/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-slate-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow min-h-[120px] resize-y"
                placeholder="Add any additional notes..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>

          {/* Voice Input Section */}
          <div className="mt-8 border-2 border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-slate-800/30 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Voice Input</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tap to record transaction details</p>
            </div>
          </div>

          {/* We hide the submit button visually, but we can trigger it or we can add a save button at bottom. The original UI screenshot doesn't show a save button (might be cut off or fixed at bottom). We will add a save button to make it functional. */}
          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
