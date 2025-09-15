
import React, { useState, useEffect } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../services/api';
import { generateDescription } from '../../services/geminiService';
import type { Product } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatRupiah } from '../../utils/helpers';
import { PencilIcon, TrashIcon, SparklesIcon, PlusIcon } from '../../components/icons/Icons';
import Modal from '../../components/ui/Modal';

const AdminProducts: React.FC = () => {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof Product | string, string>>>({});

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const data = await fetchProducts();
        setProducts(data);
    };

    const handleOpenModal = (product: Partial<Product> | null = null) => {
        setEditingProduct(product ? { ...product } : { name: '', description: '', price: 0, image_url: '', is_best_seller: false, promo_price: null, promo_end_at: null });
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editingProduct) return;
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        
        let finalValue: any = value;
        if (isCheckbox) {
            finalValue = (e.target as HTMLInputElement).checked;
        } else if (name === 'price' || name === 'promo_price') {
            finalValue = value === '' ? null : parseFloat(value);
        } else if (name === 'promo_end_at' && value === '') {
            finalValue = null;
        }

        setEditingProduct({ ...editingProduct, [name]: finalValue });
    };

    const handleGenerateDesc = async () => {
        if (!editingProduct || !editingProduct.name) return;
        setIsGenerating(true);
        const description = await generateDescription(editingProduct.name);
        setEditingProduct(prev => ({ ...prev, description }));
        setIsGenerating(false);
    };

    const validateForm = () => {
        if (!editingProduct) return false;
        const errors: Partial<Record<keyof Product | string, string>> = {};

        if (!editingProduct.name?.trim()) errors.name = t('field_required');
        if (!editingProduct.description?.trim()) errors.description = t('field_required');
        
        if (!editingProduct.image_url?.trim()) {
            errors.image_url = t('field_required');
        } else {
            try {
                new URL(editingProduct.image_url);
            } catch (_) {
                errors.image_url = t('invalid_url');
            }
        }

        if (editingProduct.price == null || isNaN(editingProduct.price) || editingProduct.price < 0) {
            errors.price = t('price_not_negative');
        }

        if (editingProduct.promo_price != null) {
            if (isNaN(editingProduct.promo_price) || editingProduct.promo_price < 0) {
                errors.promo_price = t('promo_price_not_negative');
            } else if (editingProduct.price != null && editingProduct.promo_price >= editingProduct.price) {
                errors.promo_price = t('promo_price_less_than_normal');
            }
            if (editingProduct.promo_price > 0) {
                if (!editingProduct.promo_end_at) {
                    errors.promo_end_at = t('promo_date_required');
                } else if (new Date(editingProduct.promo_end_at) <= new Date()) {
                    errors.promo_end_at = t('promo_date_future');
                }
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct || !validateForm()) return;
        
        const productData = {
            ...editingProduct,
            price: editingProduct.price || 0,
            promo_price: (editingProduct.promo_price && editingProduct.promo_price > 0) ? editingProduct.promo_price : null,
            promo_end_at: (editingProduct.promo_price && editingProduct.promo_price > 0) ? editingProduct.promo_end_at : null,
        } as Product;

        if (editingProduct.id) {
            await updateProduct(productData);
        } else {
            await addProduct(productData);
        }
        loadProducts();
        handleCloseModal();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            loadProducts();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-heading text-cyan-400">{t('products')}</h1>
                <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md hover:from-cyan-400 hover:to-fuchsia-400 transition-all">
                    <PlusIcon className="w-5 h-5"/> {t('add_new_product')}
                </button>
            </div>

            <div className="bg-slate-900/50 rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-cyan-300 uppercase bg-slate-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('product_name')}</th>
                            <th scope="col" className="px-6 py-3">{t('normal_price')}</th>
                            <th scope="col" className="px-6 py-3">{t('promo_price')}</th>
                            <th scope="col" className="px-6 py-3">{t('promo_end_date')}</th>
                            <th scope="col" className="px-6 py-3">{t('best_seller')}</th>
                            <th scope="col" className="px-6 py-3">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded-md"/>
                                    <span className="font-medium text-white">{p.name}</span>
                                </td>
                                <td className="px-6 py-4">{formatRupiah(p.price)}</td>
                                <td className="px-6 py-4">{p.promo_price ? formatRupiah(p.promo_price) : '-'}</td>
                                <td className="px-6 py-4">{p.promo_end_at ? new Date(p.promo_end_at).toLocaleString() : '-'}</td>
                                <td className="px-6 py-4">{p.is_best_seller ? 'Yes' : 'No'}</td>
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <button onClick={() => handleOpenModal(p)} className="text-cyan-400 hover:text-cyan-300"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && editingProduct && (
                 <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct.id ? 'Edit Product' : 'Add Product'}>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">{t('product_name')}</label>
                            <input type="text" name="name" value={editingProduct.name || ''} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                            {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300">{t('description')}</label>
                             <div className="relative">
                                <textarea name="description" value={editingProduct.description || ''} onChange={handleInputChange} rows={5} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                                <button type="button" onClick={handleGenerateDesc} disabled={isGenerating || !editingProduct.name} className="absolute bottom-2 right-2 flex items-center gap-1 text-xs px-2 py-1 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <SparklesIcon className="w-4 h-4"/> {isGenerating ? 'Generating...' : t('generate_description_ai')}
                                </button>
                            </div>
                            {formErrors.description && <p className="text-red-400 text-xs mt-1">{formErrors.description}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">{t('image_url')}</label>
                            <input type="text" name="image_url" value={editingProduct.image_url || ''} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                            {formErrors.image_url && <p className="text-red-400 text-xs mt-1">{formErrors.image_url}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">{t('normal_price')}</label>
                                <input type="number" name="price" value={editingProduct.price ?? ''} onChange={handleInputChange} min="0" className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                                {formErrors.price && <p className="text-red-400 text-xs mt-1">{formErrors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300">{t('promo_price')}</label>
                                <input type="number" name="promo_price" value={editingProduct.promo_price ?? ''} onChange={handleInputChange} min="0" className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                                {formErrors.promo_price && <p className="text-red-400 text-xs mt-1">{formErrors.promo_price}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">{t('promo_end_date')}</label>
                            <input type="datetime-local" name="promo_end_at" value={editingProduct.promo_end_at ? editingProduct.promo_end_at.slice(0, 16) : ''} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                            {formErrors.promo_end_at && <p className="text-red-400 text-xs mt-1">{formErrors.promo_end_at}</p>}
                        </div>
                         <div className="flex items-center gap-2">
                             <input type="checkbox" id="is_best_seller" name="is_best_seller" checked={!!editingProduct.is_best_seller} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                             <label htmlFor="is_best_seller" className="text-sm text-gray-300">{t('best_seller')}</label>
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

export default AdminProducts;