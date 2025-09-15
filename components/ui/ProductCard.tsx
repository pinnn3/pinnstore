
import React from 'react';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatRupiah, getEffectivePrice, isPromoActive } from '../../utils/helpers';
import Countdown from './Countdown';
import { PlusIcon, EyeIcon } from '../icons/Icons';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const promo = isPromoActive(product);
  const effectivePrice = getEffectivePrice(product);

  const excerpt = product.description.length > 120 
    ? product.description.substring(0, 120) + '...' 
    : product.description;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-cyan-500/20 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
      <div className="relative">
        <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-opacity duration-300"></div>
        {promo && product.promo_end_at && (
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-fuchsia-800/80 to-transparent">
             <Countdown endTime={product.promo_end_at} />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col h-[calc(100%-12rem)]">
        <h3 className="font-heading text-lg text-white truncate">{product.name}</h3>
        <div className="mt-2 flex-grow">
          <p className="text-sm text-gray-400">{excerpt}</p>
        </div>
        <div className="mt-4">
          {promo ? (
            <div>
              <p className="text-sm text-gray-500 line-through">{formatRupiah(product.price)}</p>
              <p className="text-xl font-bold text-lime-400">{formatRupiah(effectivePrice)}</p>
            </div>
          ) : (
            <p className="text-xl font-bold text-cyan-400">{formatRupiah(effectivePrice)}</p>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between space-x-2">
            <button 
              onClick={() => onViewDetails(product)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-cyan-300 bg-slate-700/50 border border-slate-600 rounded-md hover:bg-slate-700 hover:text-white transition-colors"
            >
               <EyeIcon className="w-4 h-4" />
              <span>{t('view_details')}</span>
            </button>
            <button 
              onClick={() => addToCart(product)}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md hover:from-cyan-400 hover:to-fuchsia-400 transition-all transform hover:scale-105"
            >
              <PlusIcon className="w-4 h-4" />
              <span>{t('add_to_cart')}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
