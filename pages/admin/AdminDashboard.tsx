
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminDashboard: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div>
            <h1 className="text-3xl font-heading text-cyan-400 mb-6">{t('dashboard')}</h1>
            <p className="text-gray-300">Welcome to the Pinn Store admin panel. Select a section from the menu to manage your store.</p>
            {/* In a real application, this would have charts and summary cards */}
        </div>
    );
};

export default AdminDashboard;
