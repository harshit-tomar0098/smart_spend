import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Dot } from 'recharts';
import { Calendar, DollarSign, Target, Sparkles } from 'lucide-react';
import api from '../api';

const AIPredictions = () => {
  const [loading, setLoading] = useState(true);

  // Mock data matching Figma exactly
  const lineChartData = [
    { name: 'Jan', actual: 7800 },
    { name: 'Feb', actual: 8200 },
    { name: 'Mar', actual: 7500 },
    { name: 'Apr', actual: 8300 },
    { name: 'May', predicted: 8600 },
    { name: 'Jun', predicted: 8900 },
    { name: 'Jul', predicted: 8700 },
  ];

  const areaChartData = [
    { name: 'Oct', value: 7200 },
    { name: 'Nov', value: 7600 },
    { name: 'Dec', value: 7900 },
    { name: 'Jan', value: 7800 },
    { name: 'Feb', value: 8200 },
    { name: 'Mar', value: 7500 },
    { name: 'Apr', value: 8300 },
  ];

  useEffect(() => {
    // Keep dummy matching Figma for visual perfection.
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">AI Predictions</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Smart insights powered by machine learning</p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-[1.5rem] p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <Calendar className="w-6 h-6 mb-4 opacity-90" />
          <p className="text-sm font-medium text-blue-100 mb-1">Next Month Prediction</p>
          <h3 className="text-3xl font-bold mb-2">$8,500</h3>
          <p className="text-sm font-medium text-blue-100">Expected total expenses</p>
        </div>
        <div className="bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] rounded-[1.5rem] p-6 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden">
          <DollarSign className="w-6 h-6 mb-4 opacity-90" />
          <p className="text-sm font-medium text-purple-100 mb-1">Potential Savings</p>
          <h3 className="text-3xl font-bold mb-2">$425</h3>
          <p className="text-sm font-medium text-purple-100">Based on AI recommendations</p>
        </div>
        <div className="bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-[1.5rem] p-6 text-white shadow-lg shadow-green-500/20 relative overflow-hidden">
          <Target className="w-6 h-6 mb-4 opacity-90" />
          <p className="text-sm font-medium text-green-100 mb-1">Goal Achievement</p>
          <h3 className="text-3xl font-bold mb-2">92%</h3>
          <p className="text-sm font-medium text-green-100">On track for your savings goal</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Forecast Line Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Expense Forecast</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={true} tickLine={true} tick={{ fill: '#64748B', fontSize: 13 }} dy={10} />
                <YAxis axisLine={true} tickLine={true} tick={{ fill: '#64748B', fontSize: 13 }} domain={[0, 10000]} ticks={[0, 2500, 5000, 7500, 10000]} />
                <RechartsTooltip 
                  cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }} 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '12px', border: 'none', color: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  labelStyle={{ display: 'none' }}
                  itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                />
                
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#2563EB" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#2563EB', strokeWidth: 0 }}
                  activeDot={{ r: 8 }}
                  name="actual" 
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#8B5CF6" 
                  strokeWidth={3} 
                  strokeDasharray="5 5" 
                  dot={{ r: 6, fill: '#8B5CF6', strokeWidth: 0 }}
                  activeDot={{ r: 8 }}
                  name="predicted" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8B5CF6]"></div>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Predicted</span>
            </div>
          </div>
        </div>

        {/* 6-Month Spending Trend Area Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">6-Month Spending Trend</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={true} tickLine={true} tick={{ fill: '#64748B', fontSize: 13 }} dy={10} />
                <YAxis axisLine={true} tickLine={true} tick={{ fill: '#64748B', fontSize: 13 }} domain={[0, 10000]} ticks={[0, 2500, 5000, 7500, 10000]} />
                <RechartsTooltip cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                
                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="h-10"></div> {/* Spacer to align visually with the legend on the left */}
        </div>
      </div>

      {/* Category-wise Predictions */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Category-wise Predictions</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
             <div className="flex justify-between items-center mb-1">
               <h4 className="font-bold text-slate-800 dark:text-white">Food</h4>
               <span className="text-sm font-bold text-[#FF004D]">+6.3%</span>
             </div>
             <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
               Current: $2400 <span className="mx-2">→</span> Predicted: $2550
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;
