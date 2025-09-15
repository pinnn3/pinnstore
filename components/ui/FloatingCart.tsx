import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatRupiah } from '../../utils/helpers';
import { CheckCircleIcon, XMarkIcon, ShoppingCartModernIcon } from '../icons/Icons';

const FloatingCart: React.FC = () => {
    const { t } = useLanguage();
    const { itemCount, cartSubtotal, hideFloatingCart } = useCart();
    const navigate = useNavigate();

    const handleViewCart = () => {
        hideFloatingCart();
        navigate('/cart');
    };

    const handleCheckout = () => {
        hideFloatingCart();
        navigate('/checkout');
    };
    
    return (
        <div className="fixed bottom-4 right-4 w-full max-w-sm z-50 animate-slide-in-right">
            <div className="bg-slate-800/80 backdrop-blur-md border border-fuchsia-500/30 rounded-lg shadow-2xl shadow-fuchsia-500/10 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <CheckCircleIcon className="w-6 h-6 text-lime-400" />
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-medium text-white">{t('item_added_to_cart')}</p>
                        <div className="mt-2 text-sm text-gray-300">
                           <div className="flex items-center justify-between">
                               <span>{itemCount} item(s)</span>
                               <span className="font-bold text-cyan-400">{formatRupiah(cartSubtotal)}</span>
                           </div>
                        </div>
                        <div className="mt-4 flex space-x-2">
                             <button
                                onClick={handleViewCart}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-cyan-300 bg-slate-700/50 border border-slate-600 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
                            >
                                {t('view_cart')}
                            </button>
                            <button
                                onClick={handleCheckout}
                                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md hover:from-cyan-400 hover:to-fuchsia-400 transition-all"
                            >
                                {t('checkout_now')}
                            </button>
                        </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={hideFloatingCart} className="inline-flex text-gray-400 hover:text-white">
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
            {/* FIX: Removed the 'jsx' prop from the <style> tag to resolve a TypeScript type error. */}
            <style>{`
                @keyframes slide-in-right {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in-right {
                    animation: slide-in-right 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default FloatingCart;