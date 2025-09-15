import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCart } from '../../contexts/CartContext';
import { SITE_NAME } from '../../constants';
// FIX: Replaced non-existent 'ShoppingCartIcon' with 'ShoppingCartModernIcon'.
import { ShoppingCartModernIcon } from '../icons/Icons';

const Header: React.FC = () => {
    const { lang, setLang, t } = useLanguage();
    const { itemCount } = useCart();

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive ? 'bg-cyan-500/10 text-cyan-300' : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
        }`;

    return (
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-cyan-500/20 sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="text-2xl font-heading text-white font-bold">
                            {SITE_NAME}
                        </NavLink>
                    </div>
                    <nav className="hidden md:flex items-center space-x-4">
                        <NavLink to="/" className={navLinkClasses} end>
                            {t('home')}
                        </NavLink>
                        
                    </nav>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <select
                                value={lang}
                                onChange={(e) => setLang(e.target.value as 'id' | 'en')}
                                className="bg-slate-800 border border-slate-600 rounded-md py-1 pl-2 pr-7 text-sm text-white focus:ring-cyan-500 focus:border-cyan-500"
                                aria-label="Select language"
                            >
                                <option value="id">ID</option>
                                <option value="en">EN</option>
                            </select>
                        </div>
                        <NavLink to="/cart" className="relative text-gray-300 hover:text-white transition-colors p-2">
                            <ShoppingCartModernIcon className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;