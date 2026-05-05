import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Check, ChevronDown } from 'lucide-react';
import api from '../api';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const MetricCard = ({ title, value, trend, isPositive, trendText, icon: Icon, iconColorClass, iconBgClass }) => (
  <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBgClass}`}>
      <Icon className={`w-6 h-6 ${iconColorClass}`} />
    </div>
    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{title}</p>
    <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{value}</h3>
    <div className={`text-sm font-bold ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
      {trendText}
    </div>
  </div>
);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('This Month');
  const dropdownRef = useRef(null);

  const ranges = ['This Month', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'This Year', 'Custom Range'];

  // Mock data to match Figma exactly
  const barChartData = [
    { name: 'Jan', income: 11000, expenses: 7500, savings: 3500 },
    { name: 'Feb', income: 10500, expenses: 8000, savings: 2500 },
    { name: 'Mar', income: 12000, expenses: 7200, savings: 4800 },
    { name: 'Apr', income: 12450, expenses: 8320, savings: 4130 },
  ];

  const pieData = [
    { name: 'Food', value: 29, color: '#3B82F6' },
    { name: 'Shopping', value: 22, color: '#8B5CF6' },
    { name: 'Travel', value: 14, color: '#0EA5E9' },
    { name: 'Bills', value: 18, color: '#F59E0B' },
    { name: 'Entertainment', value: 11, color: '#EC4899' },
    { name: 'Others', value: 6, color: '#64748B' },
  ];

  useEffect(() => {
    // Keeping dummy matching Figma for visual perfection.
    setLoading(false);

    // Click outside handler for dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownloadCSV = () => {
    const headers = ['Month', 'Income', 'Expenses', 'Savings'];
    const rows = barChartData.map(item => [item.name, item.income, item.expenses, item.savings]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `smartspend_report_${selectedRange.replace(/ /g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text('SmartSpend Financial Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Report Period: ${selectedRange}`, 14, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('Summary Metrics:', 14, 45);
    
    doc.setFontSize(10);
    doc.text(`Total Income: $12,450`, 14, 52);
    doc.text(`Total Expenses: $8,320`, 14, 58);
    doc.text(`Total Savings: $4,130`, 14, 64);
    doc.text(`Savings Rate: 33.2%`, 14, 70);

    const tableColumn = ["Month", "Income ($)", "Expenses ($)", "Savings ($)"];
    const tableRows = barChartData.map(item => [
      item.name,
      item.income.toLocaleString(),
      item.expenses.toLocaleString(),
      item.savings.toLocaleString()
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 85,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save(`smartspend_report_${selectedRange.replace(/ /g, '_').toLowerCase()}.pdf`);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = outerRadius * 1.4;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    const item = pieData[index];

    return (
      <text 
        x={x} 
        y={y} 
        fill={item.color} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Reports</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Comprehensive financial analytics and insights</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-sm"
          >
            <Download className="w-4 h-4" /> PDF
          </button>
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-[#4F46E5] text-white px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/30 hover:opacity-90 transition-opacity font-bold text-sm"
          >
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>

      {/* 4 Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Income (Apr)" 
          value="$12,450" 
          trendText="+8.2% from last month" 
          isPositive={true} 
          icon={TrendingUp}
          iconColorClass="text-[#3B82F6]"
          iconBgClass="bg-[#3B82F6]/10"
        />
        <MetricCard 
          title="Total Expenses (Apr)" 
          value="$8,320" 
          trendText="+10.9% from last month" 
          isPositive={false} 
          icon={TrendingDown}
          iconColorClass="text-[#EF4444]"
          iconBgClass="bg-[#EF4444]/10"
        />
        <MetricCard 
          title="Total Savings (Apr)" 
          value="$4,130" 
          trendText="+33.2% from last month" 
          isPositive={true} 
          icon={DollarSign}
          iconColorClass="text-[#10B981]"
          iconBgClass="bg-[#10B981]/10"
        />
        <MetricCard 
          title="Savings Rate" 
          value="33.2%" 
          trendText="Above target (30%)" 
          isPositive={true} 
          icon={Target}
          iconColorClass="text-[#8B5CF6]"
          iconBgClass="bg-[#8B5CF6]/10"
        />
      </div>

      {/* Date Filter Dropdown */}
      <div className="relative w-max" ref={dropdownRef}>
        <div 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="bg-white dark:bg-slate-900 rounded-[1.5rem] p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3 cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-slate-400" />
          <span className="text-slate-800 dark:text-white font-bold pr-6 select-none">
            {selectedRange}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4" />
        </div>
        
        {dropdownOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-[200px] bg-[#334155] rounded-xl shadow-2xl py-2 z-50 overflow-hidden border border-slate-600/50">
            {ranges.map((range) => (
              <div 
                key={range}
                onClick={() => {
                  setSelectedRange(range);
                  setDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer text-sm font-medium transition-colors ${
                  selectedRange === range 
                  ? 'bg-[#3B82F6] text-white' 
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <div className="w-4 flex justify-center shrink-0">
                  {selectedRange === range && <Check className="w-4 h-4 text-white" />}
                </div>
                {range}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Comparison */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Monthly Comparison</h3>
          
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={true} tickLine={false} tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={true} tickLine={false} tick={{ fill: '#64748B', fontSize: 13, fontWeight: 600 }} domain={[0, 14000]} ticks={[0, 3500, 7000, 10500, 14000]} />
                <RechartsTooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#1E293B', fontWeight: 'bold' }} />
                
                <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="savings" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#10B981]"></div>
              <span className="text-sm font-bold text-[#10B981]">income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#EF4444]"></div>
              <span className="text-sm font-bold text-[#EF4444]">expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#8B5CF6]"></div>
              <span className="text-sm font-bold text-[#8B5CF6]">savings</span>
            </div>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Expense Distribution</h3>
          
          <div className="h-[300px] w-full flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
