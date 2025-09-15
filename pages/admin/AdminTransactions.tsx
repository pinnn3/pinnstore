
import React, { useState, useEffect } from 'react';
import { fetchTransactions, updateTransactionStatus } from '../../services/api';
import type { Transaction } from '../../types';
import { TransactionStatus } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatRupiah } from '../../utils/helpers';
import Modal from '../../components/ui/Modal';

const AdminTransactions: React.FC = () => {
    const { t } = useLanguage();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [viewingProof, setViewingProof] = useState<string | null>(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        const data = await fetchTransactions();
        setTransactions(data.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    };

    const handleStatusChange = async (id: string, newStatus: TransactionStatus) => {
        await updateTransactionStatus(id, newStatus);
        loadTransactions();
    };
    
    const getStatusColor = (status: TransactionStatus) => {
        switch (status) {
            case TransactionStatus.PAID: return 'bg-lime-500/20 text-lime-300';
            case TransactionStatus.PENDING: return 'bg-yellow-500/20 text-yellow-300';
            case TransactionStatus.CANCELLED: return 'bg-red-500/20 text-red-300';
            default: return 'bg-slate-500/20 text-slate-300';
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-heading text-cyan-400 mb-6">{t('transactions')}</h1>
             <div className="bg-slate-900/50 rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-cyan-300 uppercase bg-slate-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">{t('buyer_name')}</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">{t('total_amount')}</th>
                            <th scope="col" className="px-6 py-3">{t('proof')}</th>
                            <th scope="col" className="px-6 py-3">{t('status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                                <td className="px-6 py-4">{new Date(tx.created_at).toLocaleString()}</td>
                                <td className="px-6 py-4 font-medium text-white">{tx.buyer_name}</td>
                                <td className="px-6 py-4">{tx.email}</td>
                                <td className="px-6 py-4">{formatRupiah(tx.total_amount)}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => setViewingProof(tx.proof_image_url)} className="text-cyan-400 hover:underline">
                                        View
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                     {tx.status === TransactionStatus.PENDING ? (
                                        <button onClick={() => handleStatusChange(tx.id, TransactionStatus.PAID)} className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-300 hover:bg-lime-500/30 hover:text-lime-200 transition-colors">
                                            {t('confirm_payment')}
                                        </button>
                                     ) : (
                                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                     )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {viewingProof && (
                <Modal isOpen={!!viewingProof} onClose={() => setViewingProof(null)} title="Payment Proof">
                    <img src={viewingProof} alt="Payment proof" className="w-full h-auto rounded-md" />
                </Modal>
            )}
        </div>
    );
};

export default AdminTransactions;
