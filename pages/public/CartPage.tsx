
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatRupiah, getEffectivePrice } from '../../utils/helpers';
import { TrashIcon, ArrowLeftIcon } from '../../components/icons/Icons';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const subtotal = cart.reduce((total, item) => total + getEffectivePrice(item) * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-800/50 border border-cyan-500/20 rounded-lg">
        <h1 className="text-3xl font-heading text-cyan-400 mb-4">{t('shopping_cart')}</h1>
        <p className="text-gray-400 mb-6">{t('empty_cart')}</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md hover:from-cyan-400 hover:to-fuchsia-400 transition-all">
          <ArrowLeftIcon className="w-5 h-5"/>
          {t('continue_shopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 sm:p-8 shadow-lg">
      <h1 className="text-3xl font-heading text-cyan-400 mb-6 border-b border-slate-700 pb-4">{t('shopping_cart')}</h1>
      
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900/50 rounded-md">
            <div className="flex items-center gap-4 w-full sm:w-1/2">
              <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <h3 className="font-bold text-white">{item.name}</h3>
                <p className="text-sm text-cyan-400">{formatRupiah(getEffectivePrice(item))}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 w-full sm:w-auto">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                className="w-20 bg-slate-800 border border-slate-600 rounded-md p-2 text-center text-white focus:ring-cyan-500 focus:border-cyan-500"
              />
              <p className="w-28 text-right text-gray-300">{formatRupiah(getEffectivePrice(item) * item.quantity)}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 border-t border-slate-700 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{t('total')}:</h3>
          <p className="text-2xl font-bold text-cyan-400">{formatRupiah(subtotal)}</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <button onClick={clearCart} className="w-full sm:w-auto px-6 py-3 text-sm text-red-400 bg-slate-700/50 border border-slate-600 rounded-md hover:bg-slate-700 hover:text-red-300 transition-colors">
            {t('clear_cart')}
          </button>
          <button onClick={() => navigate('/checkout')} className="w-full sm:w-auto px-10 py-3 text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md hover:from-cyan-400 hover:to-fuchsia-400 transition-all transform hover:scale-105">
            {t('proceed_to_checkout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
