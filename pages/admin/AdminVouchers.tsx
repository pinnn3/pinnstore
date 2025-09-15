import React, { useState, useEffect } from 'react';
import { fetchVouchers, addVoucher, updateVoucher, deleteVoucher } from '../../services/api';
import type { Voucher } from '../../types';
import { VoucherDiscountType } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatRupiah } from '../../utils/helpers';
import { PencilIcon, TrashIcon, PlusIcon } from '../../components/icons/Icons';
import Modal from '../../components/ui/Modal';

const AdminVouchers: React.FC = () => {
    const { t } = useLanguage();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<Partial<Voucher> | null>(null);

    useEffect(() => {
        loadVouchers();
    }, []);

    const loadVouchers = async () => {
        const data = await fetchVouchers();
        setVouchers(data);
    };

    const handleOpenModal = (voucher: Partial<Voucher> | null = null) => {
        setEditingVoucher(voucher ? { ...voucher } : { code: '', discount_type: VoucherDiscountType.FIXED, amount: 0, min_amount: 0, max_uses: 0, used_count: 0, active: true });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVoucher(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editingVoucher) return;
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        
        let finalValue: any = value;
        if (isCheckbox) {
            finalValue = (e.target as HTMLInputElement).checked;
        } else if (['amount', 'min_amount', 'max_uses'].includes(name)) {
            finalValue = value === '' ? 0 : parseFloat(value);
        } else if (name === 'code') {
            finalValue = value.toUpperCase();
        } else if ((name === 'valid_from' || name === 'valid_to') && value === '') {
            finalValue = null;
        }

        setEditingVoucher({ ...editingVoucher, [name]: finalValue });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingVoucher || !editingVoucher.code) return;
        
        const voucherData = {
            ...editingVoucher,
            discount_type: editingVoucher.discount_type || VoucherDiscountType.FIXED,
            amount: editingVoucher.amount || 0,
            min_amount: editingVoucher.min_amount || 0,
            max_uses: editingVoucher.max_uses || 0,
            used_count: editingVoucher.used_count || 0,
            active: !!editingVoucher.active
        } as Voucher;

        if (editingVoucher.id) {
            await updateVoucher(voucherData);
        } else {
            await addVoucher(voucherData);
        }
        loadVouchers();
        handleCloseModal();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this voucher?')) {
            await deleteVoucher(id);
            loadVouchers();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-heading text-cyan-400">{t('vouchers')}</h1>
                <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md hover:from-cyan-400 hover:to-fuchsia-400 transition-all">
                    <PlusIcon className="w-5 h-5"/> {t('add_new_voucher')}
                </button>
            </div>

            <div className="bg-slate-900/50 rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-cyan-300 uppercase bg-slate-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('code')}</th>
                            <th scope="col" className="px-6 py-3">{t('discount_type')}</th>
                            <th scope="col" className="px-6 py-3">{t('amount')}</th>
                            <th scope="col" className="px-6 py-3">{t('min_spend')}</th>
                            <th scope="col" className="px-6 py-3">Usage</th>
                            <th scope="col" className="px-6 py-3">{t('active')}</th>
                            <th scope="col" className="px-6 py-3">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map(v => (
                            <tr key={v.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                                <td className="px-6 py-4 font-mono text-white">{v.code}</td>
                                <td className="px-6 py-4">{v.discount_type}</td>
                                <td className="px-6 py-4">{v.discount_type === 'percent' ? `${v.amount}%` : formatRupiah(v.amount)}</td>
                                <td className="px-6 py-4">{formatRupiah(v.min_amount)}</td>
                                <td className="px-6 py-4">{v.used_count} / {v.max_uses || '∞'}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs rounded-full ${v.active ? 'bg-lime-500/20 text-lime-300' : 'bg-red-500/20 text-red-300'}`}>{v.active ? 'Yes' : 'No'}</span></td>
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <button onClick={() => handleOpenModal(v)} className="text-cyan-400 hover:text-cyan-300"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDelete(v.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && editingVoucher && (
                 <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingVoucher.id ? 'Edit Voucher' : 'Add Voucher'}>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">{t('code')}</label>
                                <input type="text" name="code" value={editingVoucher.code || ''} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">{t('discount_type')}</label>
                                <select name="discount_type" value={editingVoucher.discount_type || ''} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white">
                                    <option value="fixed">{t('fixed')}</option>
                                    <option value="percent">{t('percent')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">{t('amount')}</label>
                                <input type="number" name="amount" value={editingVoucher.amount ?? ''} onChange={handleInputChange} min="0" className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">{t('min_spend')}</label>
                                <input type="number" name="min_amount" value={editingVoucher.min_amount ?? ''} onChange={handleInputChange} min="0" className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">{t('max_uses')} (0 for unlimited)</label>
                                <input type="number" name="max_uses" value={editingVoucher.max_uses ?? ''} onChange={handleInputChange} min="0" className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">{t('used_count')}</label>
                                <input type="number" name="used_count" value={editingVoucher.used_count ?? ''} onChange={handleInputChange} min="0" className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">{t('valid_from')} (optional)</label>
                                <input type="datetime-local" name="valid_from" value={editingVoucher.valid_from ? editingVoucher.valid_from.slice(0, 16) : ''} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-300">{t('valid_to')} (optional)</label>
                                <input type="datetime-local" name="valid_to" value={editingVoucher.valid_to ? editingVoucher.valid_to.slice(0, 16) : ''} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                            </div>
                        </div>
                         <div className="flex items-center gap-2">
                             <input type="checkbox" id="active" name="active" checked={!!editingVoucher.active} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                             <label htmlFor="active" className="text-sm text-gray-300">{t('active')}</label>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm text-gray-300 bg-slate-600 rounded-md hover:bg-slate-500">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-sm text-white bg-cyan-600 rounded-md hover:bg-cyan-500">Save</button>
                        </div>
                     </form>
                 </Modal>
            )}
        </div>
    );
};

export default AdminVouchers;
