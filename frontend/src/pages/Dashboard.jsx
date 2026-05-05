import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, PiggyBank,
  ShoppingBag, Car, FileText, Sparkles
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

import api from '../api';

const categoryColors = {
  'Food': '#3B82F6',
  'Shopping': '#8B5CF6',
  'Travel': '#0EA5E9',
  'Bills': '#F59E0B',
  'Entertainment': '#EC4899',
  'Others': '#64748B'
};

const categoryIcons = {
  'Food': ShoppingBag,
  'Shopping': ShoppingBag,
  'Travel': Car,
  'Bills': FileText,
  'Entertainment': FileText,
  'Others': FileText
};

const MetricCard = ({ title, amount, trend, isPositive, icon: Icon, iconBgClass }) => (
  <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center ${iconBgClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
        {isPositive ? '↗' : '↘'} {trend > 0 && !isPositive ? '-' : ''}{Math.abs(trend)}%
      </div>
    </div>
    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800 dark:text-white">
      ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </p>
  </div>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  // Mock data matching Figma exactly
  const totalBalance = 45280.00;
  const totalIncome = 12450.00;
  const totalExpenses = 8320.00;
  const savings = 4130.00;

  const barData = [
    { name: 'Jan', income: 11000, expenses: 7500 },
    { name: 'Feb', income: 10500, expenses: 8000 },
    { name: 'Mar', income: 12000, expenses: 7200 },
    { name: 'Apr', income: 12450, expenses: 8320 },
  ];

  const pieData = [
    { name: 'Food', value: 35, color: '#3B82F6' },
    { name: 'Shopping', value: 25, color: '#8B5CF6' },
    { name: 'Travel', value: 15, color: '#0EA5E9' },
    { name: 'Bills', value: 10, color: '#F59E0B' },
    { name: 'Entertainment', value: 10, color: '#EC4899' },
    { name: 'Others', value: 5, color: '#64748B' },
  ];

  const recentTransactions = [
    { id: 1, merchant: 'Grocery Shopping', category: 'Food', date: '2026-04-21', amount: 125.50, type: 'EXPENSE' },
    { id: 2, merchant: 'Gas Station', category: 'Travel', date: '2026-04-20', amount: 45.00, type: 'EXPENSE' }
  ];

  useEffect(() => {
    // Keep dummy matching Figma for visual perfection.
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Balance" amount={totalBalance} trend={12.5} isPositive={true} 
          icon={Wallet} iconBgClass="bg-[#3B82F6]" 
        />
        <MetricCard 
          title="Total Income" amount={totalIncome} trend={8.2} isPositive={true} 
          icon={TrendingUp} iconBgClass="bg-[#10B981]" 
        />
        <MetricCard 
          title="Total Expenses" amount={totalExpenses} trend={-3.1} isPositive={false} 
          icon={TrendingDown} iconBgClass="bg-[#EF4444]" 
        />
        <MetricCard 
          title="Savings" amount={savings} trend={15.3} isPositive={true} 
          icon={PiggyBank} iconBgClass="bg-[#8B5CF6]" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Monthly Overview</h3>
          <div className="w-full h-[250px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={true} tickLine={false} tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }} domain={[0, 14000]} ticks={[0, 3500, 7000, 10500, 14000]} />
                <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#10B981]"></div>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#EF4444]"></div>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">expenses</span>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 w-full text-left">Expense by Category</h3>
          <div className="w-full max-w-[280px] h-[220px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 mt-6 w-full max-w-sm px-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-slate-600 dark:text-slate-400 font-bold">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recent Transactions</h3>
            <a href="/history" className="text-sm font-bold text-[#3B82F6] hover:text-blue-700">View All</a>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.map(tx => {
              const Icon = categoryIcons[tx.category] || FileText;
              return (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{tx.merchant}</h4>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="font-bold text-[#EF4444] text-lg">
                    ${tx.amount.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] rounded-[2rem] p-6 md:p-8 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6" />
            <h3 className="text-xl font-bold">AI Insights</h3>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-colors">
              <p className="text-sm font-medium leading-relaxed">
                You spent 15% less on shopping this month compared to last month. Great job!
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-colors">
              <p className="text-sm font-medium leading-relaxed">
                Your food expenses are trending higher. Consider meal planning to save.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
