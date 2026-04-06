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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600">Net Balance</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><IndianRupee size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">₹{summary?.netBalance?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600">Total Income</h3>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-emerald-600">+ ₹{summary?.totalIncome?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-600">Total Expenses</h3>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><TrendingDown size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-red-600">- ₹{summary?.totalExpense?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
    </div>
  );
}
