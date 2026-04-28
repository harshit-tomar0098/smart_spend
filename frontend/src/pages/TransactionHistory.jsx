import React, { useState, useEffect } from 'react';
import { FileText, ShoppingBag, Car, Filter, Search, Download } from 'lucide-react';
import api from '../api';

const categoryIcons = {
  'Food': FileText,
  'Shopping': ShoppingBag,
  'Travel': Car,
  'Bills': FileText,
  'Entertainment': FileText,
  'Others': FileText
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, INCOME, EXPENSE

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/transactions');
        setTransactions(res.data);
      } catch (error) {
        console.error('Error fetching transactions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredData = transactions.filter(t => filter === 'ALL' || t.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Transaction History</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Transactions</option>
              <option value="INCOME">Income Only</option>
              <option value="EXPENSE">Expenses Only</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {loading && <div className="p-8 text-center text-slate-500">Loading transactions...</div>}
          {!loading && filteredData.length === 0 && (
            <div className="p-8 text-center text-slate-500">No transactions found.</div>
          )}
          {filteredData.map(tx => {
            const Icon = categoryIcons[tx.category] || FileText;
            const isExpense = tx.type === 'EXPENSE';
            
            return (
              <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform bg-white dark:bg-slate-800`}>
                    <Icon className={`w-5 h-5 ${isExpense ? 'text-slate-600 dark:text-slate-400' : 'text-blue-500'}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-white">{tx.merchant || tx.category}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`font-semibold ${isExpense ? 'text-slate-800 dark:text-white' : 'text-green-600'}`}>
                  {isExpense ? '-' : '+'}${tx.amount.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
