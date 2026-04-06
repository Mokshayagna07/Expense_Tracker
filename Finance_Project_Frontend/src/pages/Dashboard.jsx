import { useEffect, useState } from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/summary'),
      api.get('/records')
    ])
      .then(([summaryRes, recordsRes]) => {
        setSummary(summaryRes.data);
        setRecords(recordsRes.data);
      })
      .catch(err => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;

  // Prepare chart data - group by date
  const chartData = records.reduce((acc, curr) => {
    const existingDate = acc.find(item => item.date === curr.date);
    if (existingDate) {
      if (curr.type === 'INCOME') existingDate.Income += curr.amount;
      if (curr.type === 'EXPENSE') existingDate.Expense += curr.amount;
    } else {
      acc.push({
        date: curr.date,
        Income: curr.type === 'INCOME' ? curr.amount : 0,
        Expense: curr.type === 'EXPENSE' ? curr.amount : 0
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  const recentActivity = [...records].reverse().slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Balance Card */}
        <div className="bg-[#1f2937] p-6 rounded-2xl shadow-lg relative overflow-hidden group border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Net Balance</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">₹{summary?.netBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
              <IndianRupee size={24} className="text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-emerald-400 font-medium">Valid</span>
            <span className="text-slate-500">Real-time</span>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-[#1f2937] p-6 rounded-2xl shadow-lg relative overflow-hidden group border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Income</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">₹{summary?.totalIncome?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-[#1f2937] p-6 rounded-2xl shadow-lg relative overflow-hidden group border border-slate-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Expenses</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">₹{summary?.totalExpense?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <TrendingDown size={24} className="text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-[#1f2937] rounded-2xl p-6 min-h-[400px] shadow-lg border border-slate-800">
          <h3 className="text-white font-bold mb-6">Income vs Expenses Tracking</h3>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="Income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
                  <Area type="monotone" dataKey="Expense" stroke="#f59e0b" fillOpacity={1} fill="url(#colorExpense)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                Start adding valid records to view dynamic charts automatically.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1f2937] rounded-2xl p-6 shadow-lg border border-slate-800">
          <h3 className="text-white font-bold mb-6 flex items-center justify-between">
            <span>Recent Activity</span>
            <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-1 rounded-full">Live</span>
          </h3>
          <div className="space-y-6">
            {recentActivity.length > 0 ? recentActivity.map((record) => (
              <div key={record.id} className="flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${record.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  <Receipt size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-slate-200 text-sm font-medium">{record.category}</p>
                    <p className={`text-sm font-bold ${record.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {record.type === 'INCOME' ? '+' : '-'}₹{record.amount}
                    </p>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">{record.date}</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-sm text-center pt-8">No recent activity detected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
