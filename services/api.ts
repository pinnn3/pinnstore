import { MOCK_PRODUCTS, MOCK_BANNERS, MOCK_VOUCHERS } from './mockData';
import type { Product, Banner, Voucher, Transaction } from '../types';
import { TransactionStatus } from '../types';

// Helper to get data from localStorage or use mock data
const getFromStorage = <T>(key: string, mockData: T[]): T[] => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error(`Error parsing ${key} from localStorage`, e);
    }
    // If nothing in storage, initialize with mock data
    localStorage.setItem(key, JSON.stringify(mockData));
    return mockData;
};

// Helper to save data to localStorage
const saveToStorage = <T>(key: string, data: T[]) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


// --- PRODUCTS API ---

export const fetchProducts = async (): Promise<Product[]> => {
    await delay(100);
    return getFromStorage<Product>('products', MOCK_PRODUCTS);
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    await delay(100);
    const products = await fetchProducts();
    const newProduct = { ...product, id: Date.now() };
    const updatedProducts = [...products, newProduct];
    saveToStorage('products', updatedProducts);
    return newProduct;
};

export const updateProduct = async (updatedProduct: Product): Promise<Product> => {
    await delay(100);
    const products = await fetchProducts();
    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    saveToStorage('products', updatedProducts);
    return updatedProduct;
};

export const deleteProduct = async (id: number): Promise<void> => {
    await delay(100);
    const products = await fetchProducts();
    const updatedProducts = products.filter(p => p.id !== id);
    saveToStorage('products', updatedProducts);
};


// --- BANNERS API ---

export const fetchBanners = async (): Promise<Banner[]> => {
    await delay(100);
    return getFromStorage<Banner>('banners', MOCK_BANNERS);
};

export const addBanner = async (banner: Omit<Banner, 'id'>): Promise<Banner> => {
    await delay(100);
    const banners = await fetchBanners();
    const newBanner = { ...banner, id: Date.now() };
    const updatedBanners = [...banners, newBanner];
    saveToStorage('banners', updatedBanners);
    return newBanner;
};

export const updateBanner = async (updatedBanner: Banner): Promise<Banner> => {
    await delay(100);
    const banners = await fetchBanners();
    const updatedBanners = banners.map(b => b.id === updatedBanner.id ? updatedBanner : b);
    saveToStorage('banners', updatedBanners);
    return updatedBanner;
};

export const deleteBanner = async (id: number): Promise<void> => {
    await delay(100);
    const banners = await fetchBanners();
    const updatedBanners = banners.filter(b => b.id !== id);
    saveToStorage('banners', updatedBanners);
};


// --- VOUCHERS API ---

export const fetchVouchers = async (): Promise<Voucher[]> => {
    await delay(100);
    return getFromStorage<Voucher>('vouchers', MOCK_VOUCHERS);
};

export const fetchVoucherByCode = async (code: string): Promise<Voucher | null> => {
    await delay(100);
    const vouchers = await fetchVouchers();
    return vouchers.find(v => v.code.toUpperCase() === code.toUpperCase()) || null;
};

export const addVoucher = async (voucher: Omit<Voucher, 'id'>): Promise<Voucher> => {
    await delay(100);
    const vouchers = await fetchVouchers();
    const newVoucher = { ...voucher, id: Date.now() };
    const updatedVouchers = [...vouchers, newVoucher];
    saveToStorage('vouchers', updatedVouchers);
    return newVoucher;
};

export const updateVoucher = async (updatedVoucher: Voucher): Promise<Voucher> => {
    await delay(100);
    const vouchers = await fetchVouchers();
    const updatedVouchers = vouchers.map(v => v.id === updatedVoucher.id ? updatedVoucher : v);
    saveToStorage('vouchers', updatedVouchers);
    return updatedVoucher;
};

export const deleteVoucher = async (id: number): Promise<void> => {
    await delay(100);
    const vouchers = await fetchVouchers();
    const updatedVouchers = vouchers.filter(v => v.id !== id);
    saveToStorage('vouchers', updatedVouchers);
};

export const incrementVoucherUsedCount = async (code: string): Promise<void> => {
    await delay(50);
    const vouchers = await fetchVouchers();
    const updatedVouchers = vouchers.map(v => 
        v.code.toUpperCase() === code.toUpperCase() ? { ...v, used_count: v.used_count + 1 } : v
    );
    saveToStorage('vouchers', updatedVouchers);
};

// --- TRANSACTIONS API ---

export const fetchTransactions = async (): Promise<Transaction[]> => {
    await delay(100);
    return getFromStorage<Transaction>('transactions', []);
};

export const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'status'>): Promise<Transaction> => {
    await delay(100);
    const transactions = await fetchTransactions();

    if (transactionData.voucher_code) {
        await incrementVoucherUsedCount(transactionData.voucher_code);
    }

    const newTransaction: Transaction = {
        ...transactionData,
        id: `TX-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        created_at: new Date().toISOString(),
        status: TransactionStatus.PAID, // Set to PAID directly after AI validation
        voucher_applied: !!transactionData.voucher_code,
    };

    const updatedTransactions = [...transactions, newTransaction];
    saveToStorage('transactions', updatedTransactions);
    return newTransaction;
};


export const updateTransactionStatus = async (id: string, status: TransactionStatus): Promise<Transaction | null> => {
    await delay(100);
    const transactions = await fetchTransactions();
    let updatedTx: Transaction | null = null;
    const updatedTransactions = transactions.map(tx => {
        if (tx.id === id) {
            // Logic to increment voucher count only when moving from non-paid to PAID
            if (tx.status !== TransactionStatus.PAID && status === TransactionStatus.PAID && tx.voucher_code && !tx.voucher_applied) {
                incrementVoucherUsedCount(tx.voucher_code);
                updatedTx = { ...tx, status, voucher_applied: true };
                return updatedTx;
            }
            updatedTx = { ...tx, status };
            return updatedTx;
        }
        return tx;
    });
    saveToStorage('transactions', updatedTransactions);
    return updatedTx;
};