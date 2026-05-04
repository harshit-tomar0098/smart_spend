import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../api';

const AIPredictions = () => {
  const [predictionData, setPredictionData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [summary, setSummary] = useState({ totalPredictedMonth: 0, comparisonLastMonth: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const [predRes, suggRes] = await Promise.all([
        api.get('/predictions'),
        api.get('/predictions/suggestions')
      ]);
      
      setPredictionData(predRes.data.chartData || []);
      setSummary({
        totalPredictedMonth: predRes.data.totalPredictedMonth || 0,
        comparisonLastMonth: predRes.data.comparisonLastMonth || 0
      });
      setSuggestions(suggRes.data || []);
    } catch (err) {
      console.error('Failed to fetch predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">AI Predictions</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-900/50 rounded-xl">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Model accuracy: 94%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">Expense Forecast (Last 4 Weeks)</h3>
          
          {loading ? (
             <div className="flex justify-center items-center h-[300px] text-slate-500">Loading predictions...</div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={predictionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 13 }} />
                  <RechartsTooltip cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  
                  <Area type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" name="Actual Spend" />
                  <Area type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" name="Predicted Spend" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Actual Spend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Predicted Spend</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-16 -mt-16"></div>
             <h3 className="text-lg font-semibold relative z-10 mb-2">Predicted End of Month</h3>
             <p className="text-3xl font-bold relative z-10 mb-1">
                ${summary.totalPredictedMonth.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
             </p>
             <p className="text-blue-100 text-sm relative z-10">
                +${summary.comparisonLastMonth} higher than last month
             </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Smart Suggestions</h3>
            <div className="space-y-4">
              {loading ? (
                <div className="text-slate-500 text-sm text-center py-4">Generating insights...</div>
              ) : suggestions.length === 0 ? (
                <div className="text-slate-500 text-sm text-center py-4">No suggestions available. Keep adding transactions!</div>
              ) : (
                suggestions.map((sug, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                     {sug.type === 'warning' ? (
                       <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                     ) : (
                       <TrendingUp className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                     )}
                     <div>
                       <h4 className="font-medium text-slate-800 dark:text-white text-sm">{sug.title}</h4>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sug.description}</p>
                     </div>
                  </div>
                ))
              )}
            </div>
            <button 
              onClick={() => alert("All personalized suggestions are currently displayed.")}
              className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View All Suggestions <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;
