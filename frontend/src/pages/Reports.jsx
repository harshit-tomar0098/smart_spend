import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Share2, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../api';

const MetricCard = ({ title, value, trend, isPositive }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{title}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white">${value}</h3>
      <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        {trend}%
      </div>
    </div>
  </div>
);

const Reports = () => {
  const [reportData, setReportData] = useState([]);
  const [metrics, setMetrics] = useState({ avgIncome: 0, avgExpense: 0, avgSavings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/transactions');
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyData = {};

      data.forEach(tx => {
        const date = new Date(tx.date);
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();
        const key = `${monthName} ${year}`;

        if (!monthlyData[key]) {
          monthlyData[key] = { name: monthName, income: 0, expenses: 0, savings: 0, monthIndex: date.getMonth(), year };
        }

        if (tx.type === 'INCOME') {
          monthlyData[key].income += tx.amount;
        } else if (tx.type === 'EXPENSE') {
          monthlyData[key].expenses += tx.amount;
        }
        monthlyData[key].savings = monthlyData[key].income - monthlyData[key].expenses;
      });

      let sortedData = Object.values(monthlyData).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.monthIndex - b.monthIndex;
      });

      if (sortedData.length > 6) {
        sortedData = sortedData.slice(-6);
      } else if (sortedData.length === 0) {
        const today = new Date();
        sortedData = [{ name: months[today.getMonth()], income: 0, expenses: 0, savings: 0 }];
      }

      setReportData(sortedData);

      let totalInc = 0, totalExp = 0, totalSav = 0;
      sortedData.forEach(d => {
        totalInc += d.income;
        totalExp += d.expenses;
        totalSav += d.savings;
      });

      const count = sortedData.length;
      setMetrics({
        avgIncome: totalInc / count,
        avgExpense: totalExp / count,
        avgSavings: totalSav / count
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Financial Reports</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => alert("Share functionality coming soon!")}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-md shadow-blue-500/30 hover:opacity-90 transition-opacity font-medium text-sm"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="Average Monthly Income" 
          value={metrics.avgIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
          trend="0.0" 
          isPositive={true} 
        />
        <MetricCard 
          title="Average Monthly Expenses" 
          value={metrics.avgExpense.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
          trend="0.0" 
          isPositive={false} 
        />
        <MetricCard 
          title="Average Monthly Savings" 
          value={metrics.avgSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
          trend="0.0" 
          isPositive={metrics.avgSavings >= 0} 
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Monthly Comparison</h3>
          <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
        </div>
        
        {loading ? (
           <div className="flex justify-center items-center h-[400px] text-slate-500">Loading reports...</div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13 }} />
                <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#1E293B' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" name="Savings" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
