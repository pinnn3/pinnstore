
import React, { useState, useEffect } from 'react';
import type { Product, Banner } from '../../types';
import { fetchProducts, fetchBanners } from '../../services/api';
import ProductCard from '../../components/ui/ProductCard';
import Modal from '../../components/ui/Modal';
import { useLanguage } from '../../contexts/LanguageContext';

const HomePage: React.FC = () => {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [latestProducts, setLatestProducts] = useState<Product[]>([]);
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const allProducts = await fetchProducts();
            const allBanners = await fetchBanners();
            setProducts(allProducts);
            setBanners(allBanners.sort((a, b) => a.sort_order - b.sort_order));

            setLatestProducts([...allProducts].sort((a, b) => b.id - a.id).slice(0, 4));
            setBestSellers(allProducts.filter(p => p.is_best_seller).slice(0, 4));
        };
        loadData();
    }, []);

    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <div className="space-y-12">
            {banners.length > 0 && (
                <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                    <a href={banners[0].link_url} target="_blank" rel="noopener noreferrer">
                        <img src={banners[0].image_url} alt="Promotion Banner" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    </a>
                </div>
            )}

            <section>
                <h2 className="font-heading text-3xl text-cyan-400 border-b-2 border-cyan-500/30 pb-2 mb-6">{t('latest_products')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestProducts.map(product => (
                        <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="font-heading text-3xl text-fuchsia-400 border-b-2 border-fuchsia-500/30 pb-2 mb-6">{t('best_sellers')}</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {bestSellers.map(product => (
                        <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
                    ))}
                </div>
            </section>

            {selectedProduct && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedProduct.name}>
                    <p>{selectedProduct.description}</p>
                </Modal>
            )}
        </div>
    );
};

export default HomePage;
