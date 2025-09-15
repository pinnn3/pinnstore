import { CartItem } from './contexts/CartContext';


export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_best_seller: boolean;
  promo_price?: number | null;
  promo_end_at?: string | null; // ISO 8601 string
}

export type { CartItem } from './contexts/CartContext';


export interface Banner {
  id: number;
  image_url: string;
  link_url: string;
  sort_order: number;
}

export enum VoucherDiscountType {
  PERCENT = 'percent',
  FIXED = 'fixed'
}

export interface Voucher {
  id: number;
  code: string;
  discount_type: VoucherDiscountType;
  amount: number;
  min_amount: number;
  max_uses: number;
  used_count: number;
  valid_from?: string | null;
  valid_to?: string | null;
  active: boolean;
}

export enum TransactionStatus {
    PENDING = 'pending',
    PAID = 'paid',
    CANCELLED = 'cancelled'
}

export interface Transaction {
  id: string;
  created_at: string;
  buyer_name: string;
  email: string;
  telegram_user?: string;
  cart_json: string;
  total_amount: number;
  proof_image_url: string; // Will be a data URL for simulation
  voucher_code?: string;
  voucher_discount?: number;
  status: TransactionStatus;
  voucher_applied?: boolean; // To track if voucher use has been counted
}