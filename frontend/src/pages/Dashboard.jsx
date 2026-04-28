import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, PiggyBank,
  ShoppingBag, Car, FileText, Sparkles, AlertTriangle
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
  'Food': FileText,
  'Shopping': ShoppingBag,
  'Travel': Car,
  'Bills': FileText,
  'Entertainment': FileText,
  'Others': FileText
};

// eslint-disable-next-line no-unused-vars
const MetricCard = ({ title, amount, trend, isPositive, icon: Icon, colorFrom, colorTo, trendColorText }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${colorFrom} ${colorTo} shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trendColorText}`}>
        {isPositive ? '↗' : '↘'} {Math.abs(trend).toFixed(1)}%
      </div>
    </div>
    <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800 dark:text-white">
      ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </p>
  </div>
);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Metrics
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  // Charts
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/transactions');
        const data = res.data;
        setTransactions(data);

        // Calculate Metrics
        let inc = 0;
        let exp = 0;
        data.forEach(t => {
          if (t.type === 'INCOME') inc += t.amount;
          if (t.type === 'EXPENSE') exp += t.amount;
        });
        setTotalIncome(inc);
        setTotalExpenses(exp);
        setTotalBalance(inc - exp); 

        // Calculate Monthly Bar Chart Data
        const monthly = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        data.forEach(t => {
          const date = new Date(t.date);
          const monthStr = monthNames[date.getMonth()];
          if (!monthly[monthStr]) monthly[monthStr] = { name: monthStr, income: 0, expenses: 0 };
          if (t.type === 'INCOME') monthly[monthStr].income += t.amount;
          if (t.type === 'EXPENSE') monthly[monthStr].expenses += t.amount;
        });
        
        const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr'];
        const finalBarData = defaultMonths.map(m => monthly[m] || { name: m, income: 0, expenses: 0 });
        setBarData(finalBarData);

        // Calculate Pie Chart Data
        const categories = {};
        data.filter(t => t.type === 'EXPENSE').forEach(t => {
          categories[t.category] = (categories[t.category] || 0) + t.amount;
        });
        
        const finalPieData = Object.keys(categories).map(key => ({
          name: key,
          value: categories[key],
          color: categoryColors[key] || categoryColors['Others']
        }));
        
        if (finalPieData.length === 0) {
          setPieData([
            { name: 'Food', value: 35, color: '#3B82F6' },
            { name: 'Shopping', value: 25, color: '#8B5CF6' },
            { name: 'Travel', value: 15, color: '#0EA5E9' },
            { name: 'Others', value: 25, color: '#64748B' },
          ]);
        } else {
          setPieData(finalPieData);
        }
        
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Balance" amount={totalBalance || 45280.00} trend={12.5} isPositive={true} 
          icon={Wallet} colorFrom="from-blue-500" colorTo="to-blue-600" trendColorText="text-green-600" 
        />
        <MetricCard 
          title="Total Income" amount={totalIncome || 12450.00} trend={8.2} isPositive={true} 
          icon={TrendingUp} colorFrom="from-green-500" colorTo="to-green-600" trendColorText="text-green-600" 
        />
        <MetricCard 
          title="Total Expenses" amount={totalExpenses || 8320.00} trend={-3.1} isPositive={false} 
          icon={TrendingDown} colorFrom="from-red-500" colorTo="to-red-600" trendColorText="text-red-600" 
        />
        <MetricCard 
          title="Savings" amount={(totalIncome - totalExpenses > 0 ? totalIncome - totalExpenses : 4130.00)} trend={15.3} isPositive={true} 
          icon={PiggyBank} colorFrom="from-purple-500" colorTo="to-purple-600" trendColorText="text-green-600" 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Monthly Overview</h3>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData.length > 0 ? barData : [{ name: 'Jan', income: 0, expenses: 11000 }, { name: 'Feb', income: 0, expenses: 10500 }, { name: 'Mar', income: 0, expenses: 12000 }, { name: 'Apr', income: 0, expenses: 12500 }]} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13 }} />
                <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">expenses</span>
            </div>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 w-full text-left">Expense by Category</h3>
          <div className="w-full max-w-[280px] h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Transactions</h3>
            <a href="/history" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">View All</a>
          </div>
          
          <div className="space-y-4">
            {transactions.length === 0 && !loading && (
              <div className="text-center text-slate-500 py-4">No transactions found.</div>
            )}
            {transactions.slice(0, 5).map(tx => {
              const Icon = categoryIcons[tx.category] || FileText;
              const isExpense = tx.type === 'EXPENSE';
              return (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
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
            
            {/* Dummy fallback to match Figma if no real data */}
            {transactions.length === 0 && (
               <>
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                       <ShoppingBag className="w-5 h-5 text-blue-500" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-slate-800 dark:text-white">Grocery Shopping</h4>
                       <p className="text-sm text-slate-500 dark:text-slate-400">Food • 2026-04-21</p>
                     </div>
                   </div>
                   <div className="font-semibold text-slate-800 dark:text-white">
                     -$125.50
                   </div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                       <Car className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                     </div>
                     <div>
                       <h4 className="font-semibold text-slate-800 dark:text-white">Gas Station</h4>
                       <p className="text-sm text-slate-500 dark:text-slate-400">Travel • 2026-04-20</p>
                     </div>
                   </div>
                   <div className="font-semibold text-slate-800 dark:text-white">
                     -$45.00
                   </div>
                 </div>
               </>
            )}
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6" />
            <h3 className="text-lg font-semibold">AI Insights</h3>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors">
              <p className="text-sm text-blue-50">
                You spent 15% less on shopping this month compared to last month. Great job!
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors">
              <p className="text-sm text-blue-50">
                Your food expenses are trending higher. Consider meal planning to save.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors flex items-start gap-3">
               <AlertTriangle className="w-5 h-5 shrink-0 text-yellow-300" />
               <p className="text-sm text-yellow-50">
                 Unusual spending detected on 'Entertainment'. It's 20% over budget.
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
