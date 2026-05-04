import React, { useContext, useState, useEffect } from 'react';
import { User, Bell, Shield, Smartphone, CreditCard, LogOut, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// eslint-disable-next-line no-unused-vars
const SettingItem = ({ icon: Icon, title, description, action }) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
      </div>
      <div>
        <h4 className="font-medium text-slate-800 dark:text-white">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
    {action || (
      <button 
        onClick={() => alert("Edit feature is coming soon!")}
        className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      >
        Edit
      </button>
    )}
  </div>
);

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account preferences and settings</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{user?.name || 'User Name'}</h3>
              <p className="text-slate-500 dark:text-slate-400">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/20">Account</h3>
          <SettingItem icon={User} title="Personal Information" description="Update your name, email, and phone number" />
          <SettingItem icon={Shield} title="Security & Password" description="Manage password and 2-step verification" />
          <SettingItem icon={CreditCard} title="Billing & Subscriptions" description="Manage your payment methods and current plan" />
        </div>

        <div>
          <h3 className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/20">Preferences</h3>
          <SettingItem 
            icon={Moon} 
            title="Appearance" 
            description="Toggle between light and dark mode" 
            action={
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={isDark}
                  onChange={toggleDarkMode}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
              </label>
            }
          />
          <SettingItem icon={Bell} title="Notifications" description="Manage email and push notifications" />
          <SettingItem icon={Smartphone} title="Connected Devices" description="Manage devices connected to your account" />
        </div>

        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full sm:w-auto"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
