import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Share2, TrendingUp, TrendingDown } from 'lucide-react';

const reportData = [
  { name: 'Jan', income: 11000, expenses: 8500, savings: 2500 },
  { name: 'Feb', income: 10500, expenses: 9000, savings: 1500 },
  { name: 'Mar', income: 12000, expenses: 8200, savings: 3800 },
  { name: 'Apr', income: 12500, expenses: 8800, savings: 3700 },
  { name: 'May', income: 13000, expenses: 8500, savings: 4500 },
  { name: 'Jun', income: 12800, expenses: 9200, savings: 3600 },
];

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
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Financial Reports</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-md shadow-blue-500/30 hover:opacity-90 transition-opacity font-medium text-sm">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Average Monthly Income" value="11,966.67" trend="5.2" isPositive={true} />
        <MetricCard title="Average Monthly Expenses" value="8,700.00" trend="2.1" isPositive={false} />
        <MetricCard title="Average Monthly Savings" value="3,266.67" trend="12.4" isPositive={true} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Monthly Comparison</h3>
          <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <option>Last 6 Months</option>
            <option>This Year</option>
          </select>
        </div>
        
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13 }} />
              <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" name="Savings" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
