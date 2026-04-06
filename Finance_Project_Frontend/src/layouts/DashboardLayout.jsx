import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, List, PieChart, Wallet } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/auth');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Records', path: '/records', icon: <List size={20} /> },
    { name: 'Summary', path: '/summary', icon: <PieChart size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col relative">
        <div className="h-16 flex items-center justify-center border-b border-slate-200">
          <h1 className="font-bold text-xl text-blue-600">Finance Dashboard</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-8 left-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Access</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-semibold text-slate-800">
            {navLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800 leading-tight">
                {localStorage.getItem('email') || 'user@example.com'}
              </p>
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                User Role
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
