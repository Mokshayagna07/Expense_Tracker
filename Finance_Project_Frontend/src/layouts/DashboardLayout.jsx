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
    <div className="flex h-screen bg-[#111827] text-slate-200 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#1f2937] border-r border-slate-800 flex flex-col relative shrink-0">
        <div className="h-16 flex items-center justify-center border-b border-slate-800 px-6">
          <h1 className="font-bold text-xl"><span className="text-emerald-500">Finance</span><span className="text-white">Dashboard</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className={`${location.pathname === link.path ? 'text-white' : 'text-slate-400'}`}>
                {link.icon}
              </div>
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-6 w-full px-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-400 hover:text-red-300 transition hover:bg-red-500/10 rounded-xl"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f172a]">
        {/* Navbar */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <h2 className="text-2xl font-bold text-white">
            {navLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
              {(localStorage.getItem('email') || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-200 leading-tight">
                {localStorage.getItem('email') || 'User'}
              </p>
              <p className="text-xs text-slate-500 font-medium">User</p>
            </div>
          </div>
        </header>

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
