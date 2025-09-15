import React, { useState, useEffect } from 'react';
import { fetchBanners, addBanner, updateBanner, deleteBanner } from '../../services/api';
import type { Banner } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { PencilIcon, TrashIcon, PlusIcon } from '../../components/icons/Icons';
import Modal from '../../components/ui/Modal';

const AdminBanners: React.FC = () => {
    const { t } = useLanguage();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        const data = await fetchBanners();
        setBanners(data.sort((a, b) => a.sort_order - b.sort_order));
    };

    const handleOpenModal = (banner: Partial<Banner> | null = null) => {
        setEditingBanner(banner ? { ...banner } : { image_url: '', link_url: '#', sort_order: 0 });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingBanner) return;
        const { name, value } = e.target;
        setEditingBanner({ ...editingBanner, [name]: name === 'sort_order' ? parseInt(value, 10) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBanner || !editingBanner.image_url) return;
        
        const bannerData = {
            ...editingBanner,
            sort_order: editingBanner.sort_order || 0,
            link_url: editingBanner.link_url || '#',
            image_url: editingBanner.image_url,
        } as Banner;

        if (editingBanner.id) {
            await updateBanner(bannerData);
        } else {
            await addBanner(bannerData);
        }
        loadBanners();
        handleCloseModal();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            await deleteBanner(id);
            loadBanners();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-heading text-cyan-400">{t('banners')}</h1>
                <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-md hover:from-cyan-400 hover:to-fuchsia-400 transition-all">
                    <PlusIcon className="w-5 h-5"/> {t('add_new_banner')}
                </button>
            </div>

            <div className="bg-slate-900/50 rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-cyan-300 uppercase bg-slate-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Image</th>
                            <th scope="col" className="px-6 py-3">{t('link_url')}</th>
                            <th scope="col" className="px-6 py-3">{t('sort_order')}</th>
                            <th scope="col" className="px-6 py-3">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map(b => (
                            <tr key={b.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                                <td className="px-6 py-4">
                                    <img src={b.image_url} alt="Banner" className="w-32 h-16 object-cover rounded-md"/>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm text-white">{b.link_url}</td>
                                <td className="px-6 py-4">{b.sort_order}</td>
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <button onClick={() => handleOpenModal(b)} className="text-cyan-400 hover:text-cyan-300"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && editingBanner && (
                 <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingBanner.id ? 'Edit Banner' : 'Add Banner'}>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">{t('image_url')}</label>
                            <input type="text" name="image_url" value={editingBanner.image_url || ''} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300">{t('link_url')}</label>
                             <input type="text" name="link_url" value={editingBanner.link_url || ''} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">{t('sort_order')}</label>
                            <input type="number" name="sort_order" value={editingBanner.sort_order ?? 0} onChange={handleInputChange} className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white" />
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

export default AdminBanners;
