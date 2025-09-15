
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
      `block px-4 py-2 rounded-md text-sm transition-colors ${
        isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
      }`;

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 flex-shrink-0 bg-slate-800/50 border border-cyan-500/20 rounded-lg p-4">
                <h2 className="text-xl font-heading text-cyan-400 mb-6 px-2">{t('admin_panel')}</h2>
                <nav className="space-y-2">
                    <NavLink to="/admin" end className={navLinkClasses}>{t('dashboard')}</NavLink>
                    <NavLink to="/admin/products" className={navLinkClasses}>{t('products')}</NavLink>
                    <NavLink to="/admin/banners" className={navLinkClasses}>{t('banners')}</NavLink>
                    <NavLink to="/admin/vouchers" className={navLinkClasses}>{t('vouchers')}</NavLink>
                    <NavLink to="/admin/transactions" className={navLinkClasses}>{t('transactions')}</NavLink>
                </nav>
                 <button onClick={handleLogout} className="w-full mt-8 px-4 py-2 text-sm text-gray-300 bg-slate-700 rounded-md hover:bg-red-600/50 hover:text-white transition-colors">
                    {t('logout')}
                </button>
            </aside>
            <div className="flex-grow bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;
