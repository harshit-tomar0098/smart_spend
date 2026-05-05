import React, { useContext } from 'react';
import { 
  Wallet, LayoutDashboard, PlusCircle, FileText, PieChart as PieChartIcon, 
  TrendingUp, BarChart3, Settings, Moon, Sun, Bell, User, X
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/add-transaction', icon: PlusCircle, label: 'Add Transaction' },
  { path: '/history', icon: FileText, label: 'Transaction History' },
  { path: '/budget', icon: PieChartIcon, label: 'Budget Planner' },
  { path: '/predictions', icon: TrendingUp, label: 'AI Predictions' },
  { path: '/reports', icon: FileText, label: 'Reports' }, // Actually Figma used FileText for Reports according to the HTML
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-40 w-64">
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SmartSpend</span>
        </div>
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>
      
      <nav className="p-4 space-y-2">
        {NAV_ITEMS.map((item, idx) => (
          <NavLink 
            key={idx} 
            to={item.path} 
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const Header = ({ title }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
          {title.startsWith('Welcome back') || title === 'Dashboard' ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here's your financial overview</p>
          ) : (
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your {title.toLowerCase()}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5 text-slate-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
          <div className="relative">
            <button className="relative p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-medium">{user?.name?.split(' ')[0] || 'Profile'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const Layout = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const currentItem = NAV_ITEMS.find(item => item.path === location.pathname);
  const title = currentItem ? currentItem.label : 'Dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <Sidebar />
      <div className="transition-all duration-300 ml-64">
        <Header title={location.pathname === '/' ? `Welcome back, ${user?.name?.split(' ')[0] || 'User'}` : title} />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
