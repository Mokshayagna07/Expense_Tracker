import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import api from '../api';

export default function Records() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ amount: '', type: 'INCOME', category: '', date: '', notes: '' });

  const fetchRecords = async () => {
    try {
      const res = await api.get('/records');
      setRecords(res.data);
    } catch (err) {
      setError('Failed to fetch records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/records/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/records', formData);
      }
      setFormData({ amount: '', type: 'INCOME', category: '', date: '', notes: '' });
      fetchRecords();
    } catch (err) {
      alert('Failed to save record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you certain you want to delete this record?')) return;
    try {
      await api.delete(`/records/${id}`);
      fetchRecords();
    } catch (err) {
      alert('Failed to delete record.');
    }
  };

  const startEdit = (record) => {
    setEditingId(record.id);
    setFormData({
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date,
      notes: record.notes || ''
    });
  };

  if (loading) return <div className="text-slate-500">Loading records...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold text-slate-800">Financial Records</h2>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table Area (Takes up 2/3 space on large screens) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-semibold text-slate-700">Date</th>
                  <th className="p-4 font-semibold text-slate-700">Category</th>
                  <th className="p-4 font-semibold text-slate-700">Type</th>
                  <th className="p-4 font-semibold text-slate-700">Amount</th>
                  <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">No records found.</td>
                  </tr>
                ) : records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-600">{record.date}</td>
                    <td className="p-4 font-medium text-slate-800">{record.category}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${record.type === 'INCOME' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {record.type}
                      </span>
                    </td>
                    <td className={`p-4 font-bold ${record.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                      ₹{Number(record.amount).toFixed(2)}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => startEdit(record)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition mr-2">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(record.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form Area */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
              <h3 className="font-semibold text-lg text-slate-800 mb-4 pb-2 border-b">
                {editingId ? 'Edit Record' : 'Add New Record'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                  <input type="number" step="0.01" required className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select required className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500 bg-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input type="text" required className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input type="date" required className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                  <textarea rows="2" className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
                    {editingId ? 'Update' : 'Save'} Record
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setFormData({ amount: '', type: 'INCOME', category: '', date: '', notes: '' }); }} className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
        </div>
      )}
    </div>
  );
}
