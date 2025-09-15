import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatRupiah, getEffectivePrice, calculateVoucherDiscount, validateVoucher } from '../../utils/helpers';
import { fetchVoucherByCode, createTransaction } from '../../services/api';
// FIX: Imported the 'analyzePaymentProof' function to resolve the undefined error.
import { analyzePaymentProof } from '../../services/geminiService';
import type { Voucher } from '../../types';
import { QRIS_IMAGE } from '../../constants';

const CheckoutPage: React.FC = () => {
    const { cart, clearCart } = useCart();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telegram: '',
    });
    const [proofImage, setProofImage] = useState<File | null>(null);
    const [proofImageUrl, setProofImageUrl] = useState<string | null>(null);
    const [voucherCode, setVoucherCode] = useState('');
    const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
    const [voucherMessage, setVoucherMessage] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const subtotal = useMemo(() => cart.reduce((total, item) => total + getEffectivePrice(item) * item.quantity, 0), [cart]);
    const discount = useMemo(() => appliedVoucher ? calculateVoucherDiscount(appliedVoucher, subtotal) : 0, [appliedVoucher, subtotal]);
    const grandTotal = subtotal - discount;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProofImage(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setProofImageUrl(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) return;
        const voucher = await fetchVoucherByCode(voucherCode);
        if (voucher) {
            const validation = validateVoucher(voucher, subtotal);
            if (validation.isValid) {
                setAppliedVoucher(voucher);
                setVoucherMessage({ text: t('voucher_valid'), type: 'success' });
            } else {
                setAppliedVoucher(null);
                setVoucherMessage({ text: t(validation.message as any), type: 'error' });
            }
        } else {
            setAppliedVoucher(null);
            setVoucherMessage({ text: t('voucher_not_found'), type: 'error' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !proofImage) {
            alert('Please fill all required fields and upload payment proof.');
            return;
        }
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const isProofValid = await analyzePaymentProof(proofImage);

            if (!isProofValid) {
                setSubmitError(t('invalid_proof'));
                setIsSubmitting(false);
                return;
            }

            const transactionData = {
                buyer_name: formData.name,
                email: formData.email,
                telegram_user: formData.telegram,
                cart_json: JSON.stringify(cart.map(item => ({ name: item.name, quantity: item.quantity }))),
                total_amount: grandTotal,
                proof_image_url: proofImageUrl!,
                voucher_code: appliedVoucher?.code,
                voucher_discount: discount,
            };
            const newTransaction = await createTransaction(transactionData);
            clearCart();
            
            const productNames = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');

            navigate('/thank-you', { 
                state: { 
                    transactionId: newTransaction.id, 
                    buyerName: formData.name, 
                    email: formData.email,
                    proofUrl: proofImageUrl,
                    productNames,
                } 
            });

        } catch (error) {
            console.error("Failed to create transaction", error);
            setSubmitError("There was an error submitting your order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold text-white">Your cart is empty.</h1>
                <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded">
                    Go Shopping
                </button>
            </div>
        );
    }
    
    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-lg border border-cyan-500/20">
                    <h2 className="text-2xl font-heading text-cyan-400 mb-4">{t('buyer_information')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">{t('full_name')}</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">{t('email_address')}</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="telegram" className="block text-sm font-medium text-gray-300">{t('telegram_username_optional')}</label>
                            <input type="text" id="telegram" name="telegram" value={formData.telegram} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                        </div>
                    </div>
                </div>
                 <div className="bg-slate-800/50 p-6 rounded-lg border border-cyan-500/20">
                    <h2 className="text-2xl font-heading text-cyan-400 mb-4">{t('payment_method')}</h2>
                    <div className="text-sm text-gray-400 space-y-2 mb-4">
                        <p>{t('payment_instruction_1')}</p>
                        <p>{t('payment_instruction_2')}</p>
                        <p>{t('payment_instruction_3')}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-2 rounded-lg">
                           <img src={QRIS_IMAGE} alt="QRIS Payment" className="w-64 h-94" />
                        </div>
                        <div className="mt-4 w-full max-w-sm">
                             <label htmlFor="proof" className="block text-sm font-medium text-gray-300 mb-2">{t('upload_proof')}</label>
                            <input type="file" id="proof" accept="image/*" onChange={handleProofUpload} required className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-cyan-300 hover:file:bg-slate-600" />
                            {proofImageUrl && <img src={proofImageUrl} alt="Proof preview" className="mt-4 w-32 h-32 object-cover rounded-md" />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1">
                <div className="bg-slate-800/50 p-6 rounded-lg border border-cyan-500/20 sticky top-24">
                    <h2 className="text-2xl font-heading text-cyan-400 mb-4">{t('order_summary')}</h2>
                    <div className="space-y-3 text-sm">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between text-gray-300">
                                <span className="truncate pr-2">{item.name} x {item.quantity}</span>
                                <span className="flex-shrink-0">{formatRupiah(getEffectivePrice(item) * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-700 my-4"></div>
                    <div className="space-y-2">
                        <div className="flex justify-between font-semibold text-white">
                            <span>{t('subtotal')}</span>
                            <span>{formatRupiah(subtotal)}</span>
                        </div>
                        {appliedVoucher && (
                             <div className="flex justify-between text-lime-400">
                                <span>{t('discount')} ({appliedVoucher.code})</span>
                                <span>-{formatRupiah(discount)}</span>
                            </div>
                        )}
                        <div className="border-t border-slate-700 my-4"></div>
                        <div className="flex justify-between text-xl font-bold text-cyan-400">
                            <span>{t('grand_total')}</span>
                            <span>{formatRupiah(grandTotal)}</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <label htmlFor="voucher" className="block text-sm font-medium text-gray-300 mb-1">{t('voucher_code')}</label>
                        <div className="flex gap-2">
                            <input type="text" id="voucher" value={voucherCode} onChange={e => setVoucherCode(e.target.value.toUpperCase())} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                            <button type="button" onClick={handleApplyVoucher} className="px-4 py-2 text-sm bg-slate-600 text-white rounded-md hover:bg-slate-500">{t('apply_voucher')}</button>
                        </div>
                        {voucherMessage.text && <p className={`text-xs mt-2 ${voucherMessage.type === 'success' ? 'text-lime-400' : 'text-red-400'}`}>{voucherMessage.text}</p>}
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full mt-6 px-6 py-3 text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md hover:from-cyan-400 hover:to-fuchsia-400 transition-all disabled:opacity-50 disabled:cursor-wait">
                        {isSubmitting ? t('analyzing_proof') : t('submit_order')}
                    </button>
                    {submitError && <p className="text-red-400 text-xs mt-2 text-center">{submitError}</p>}
                </div>
            </div>
        </form>
    );
};

export default CheckoutPage;