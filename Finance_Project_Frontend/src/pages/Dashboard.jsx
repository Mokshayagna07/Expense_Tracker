import { useEffect, useState } from 'react';
import { IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/dashboard/summary')
      .then(res => setSummary(res.data))
      .catch(err => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500">Loading dashboard...</div>;
  if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Balance Card */}
        <div className="bg-[#1f2937] p-6 rounded-2xl shadow-lg relative overflow-hidden group">
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
            <span className="text-emerald-400 font-medium">+15.3%</span>
            <span className="text-slate-500">from last month</span>
          </div>
        </div>

        {/* Total Income Card */}
        <div className="bg-[#1f2937] p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Income</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">₹{summary?.totalIncome?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} className="text-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-emerald-400 font-medium">+12.5%</span>
            <span className="text-slate-500">from last month</span>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-[#1f2937] p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Total Expenses</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">₹{summary?.totalExpense?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
              <TrendingDown size={24} className="text-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingDown size={16} className="text-red-400" />
            <span className="text-red-400 font-medium">+2.4%</span>
            <span className="text-slate-500">from last month</span>
          </div>
        </div>
      </div>

      {/* Placeholder blocks to mimic the bottom of KisanStore */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1f2937] rounded-2xl p-6 min-h-[400px] flex items-center justify-center shadow-lg">
          <p className="text-slate-500">Chart Loading...</p>
        </div>
        <div className="bg-[#1f2937] rounded-2xl p-6 shadow-lg">
          <h3 className="text-white font-bold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold shrink-0">
                  U
                </div>
                <div>
                  <p className="text-slate-200 text-sm font-medium">New transaction recorded</p>
                  <p className="text-slate-500 text-xs mt-1">{i * 2} minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
