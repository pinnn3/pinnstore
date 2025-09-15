import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { TELEGRAM_SHARE_URL_TEMPLATE } from '../../constants';

const OrderConfirmationPage: React.FC = () => {
    const { state } = useLocation();
    const { t } = useLanguage();

    if (!state || !state.transactionId) {
        return (
            <div className="text-center p-8 bg-slate-800/50 border border-cyan-500/20 rounded-lg">
                <h1 className="text-2xl font-bold text-white">Invalid Order Confirmation</h1>
                <p className="text-gray-400 mt-2">No order details found.</p>
                <Link to="/" className="mt-6 inline-block px-6 py-2 bg-cyan-500 text-white rounded">
                    {t('back_to_home')}
                </Link>
            </div>
        );
    }
    
    const { transactionId, buyerName, email } = state;

    const telegramUrl = TELEGRAM_SHARE_URL_TEMPLATE
        .replace('{NAME}', encodeURIComponent(buyerName))
        .replace('{EMAIL}', encodeURIComponent(email))
        .replace('{PRODUCTS}', encodeURIComponent(`transaction ID ${transactionId}`));

    return (
        <div className="max-w-2xl mx-auto text-center p-8 bg-slate-800/50 border border-cyan-500/20 rounded-lg shadow-lg">
            <h1 className="text-3xl font-heading text-cyan-400 mb-4">{t('thank_you_for_order')}</h1>
            <p className="text-gray-300 mb-6">{t('order_confirmation_message')}</p>
            <div className="bg-slate-900/50 p-4 rounded-md text-left">
                <h2 className="font-bold text-white mb-2">{t('order_details')}:</h2>
                <p className="text-gray-400 text-sm">{t('transaction_id')}: <span className="font-mono text-lime-400">{transactionId}</span></p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                 <Link to="/" className="w-full sm:w-auto px-6 py-3 text-sm text-cyan-300 bg-slate-700/50 border border-slate-600 rounded-md hover:bg-slate-700 hover:text-white transition-colors">
                    {t('back_to_home')}
                </Link>
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-3 text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md hover:from-cyan-400 hover:to-fuchsia-400 transition-all">
                    {/* FIX: Corrected i18n key from 'contact_support_telegram' to 'contact_admin_telegram'. */}
                    {t('contact_admin_telegram')}
                </a>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;