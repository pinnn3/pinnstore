
import type { Product, Voucher } from '../types';

/**
 * Formats a number as Indonesian Rupiah (IDR).
 * @param amount The number to format.
 * @returns A string formatted as IDR currency.
 */
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};


/**
 * Checks if a product's promotion is currently active.
 * @param product The product to check.
 * @returns True if the promo is active, false otherwise.
 */
export const isPromoActive = (product: Product): boolean => {
  if (!product.promo_price || !product.promo_end_at) {
    return false;
  }
  const now = new Date();
  const promoEnd = new Date(product.promo_end_at);
  return product.promo_price < product.price && promoEnd > now;
};


/**
 * Gets the effective price of a product, considering any active promotions.
 * @param product The product.
 * @returns The effective price.
 */
export const getEffectivePrice = (product: Product): number => {
  if (isPromoActive(product) && product.promo_price) {
    return product.promo_price;
  }
  return product.price;
};

/**
 * Validates if a voucher can be applied based on current conditions.
 * @param voucher The voucher to validate.
 * @param subtotal The current cart subtotal.
 * @returns An object with `isValid` and a `message` string.
 */
export const validateVoucher = (voucher: Voucher, subtotal: number): { isValid: boolean, message: string } => {
    const now = new Date();
    if (!voucher.active) {
        return { isValid: false, message: 'voucher_inactive' };
    }
    if (voucher.valid_from && new Date(voucher.valid_from) > now) {
        return { isValid: false, message: 'voucher_not_started' };
    }
    if (voucher.valid_to && new Date(voucher.valid_to) < now) {
        return { isValid: false, message: 'voucher_expired' };
    }
    if (voucher.max_uses > 0 && voucher.used_count >= voucher.max_uses) {
        return { isValid: false, message: 'voucher_limit_reached' };
    }
    if (subtotal < voucher.min_amount) {
        return { isValid: false, message: 'voucher_min_spend_not_met' };
    }
    return { isValid: true, message: 'voucher_valid' };
}

/**
 * Calculates the discount amount for a given voucher and subtotal.
 * @param voucher The voucher object.
 * @param subtotal The cart subtotal.
 * @returns The calculated discount amount.
 */
export const calculateVoucherDiscount = (voucher: Voucher, subtotal: number): number => {
    const validation = validateVoucher(voucher, subtotal);
    if (!validation.isValid) {
        return 0;
    }

    let discount = 0;
    if (voucher.discount_type === 'percent') {
        discount = Math.floor(subtotal * (voucher.amount / 100));
    } else { // fixed
        discount = voucher.amount;
    }

    // Ensure discount is not more than the subtotal
    return Math.min(discount, subtotal);
};
