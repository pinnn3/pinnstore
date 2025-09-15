
import type { Product, Banner, Voucher } from '../types';
import { VoucherDiscountType } from '../types';

const getFutureDate = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
};

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Tools Generator Veo 2 & 3",
        description: "The ultimate automated video creation tool suite, combining the power of both Veo 2 and Veo 3 generators. Create stunning, professional-quality videos in minutes with advanced AI features, extensive template libraries, and seamless integration. Perfect for marketers, content creators, and businesses looking to scale their video production effortlessly.",
        price: 370000,
        image_url: 'https://picsum.photos/seed/veo23/600/400',
        is_best_seller: true,
        promo_price: 250000,
        promo_end_at: new Date('2025-09-17T23:59:59').toISOString(),
    },
    {
        id: 2,
        name: "Tools Generator Veo 3",
        description: "Harness the next generation of AI video generation with Veo 3. This powerful tool offers cutting-edge features, enhanced rendering speeds, and an intuitive interface to bring your creative visions to life. From cinematic shorts to engaging social media content, Veo 3 is your go-to solution for high-impact video creation.",
        price: 170000,
        image_url: 'https://picsum.photos/seed/veo3/600/400',
        is_best_seller: true,
        promo_price: null,
        promo_end_at: null,
    },
    {
        id: 3,
        name: "Tools Generator Veo 2",
        description: "A reliable and feature-rich tool for automated video creation. Veo 2 is perfect for beginners and professionals alike, offering a wide range of templates and customization options to produce high-quality videos quickly and efficiently. A proven workhorse for all your video content needs.",
        price: 170000,
        image_url: 'https://picsum.photos/seed/veo2/600/400',
        is_best_seller: false,
        promo_price: null,
        promo_end_at: null,
    },
    {
        id: 4,
        name: "AI Content Architect",
        description: "Build entire content campaigns with a single prompt. This architect tool analyzes market trends and generates blog posts, social media updates, and video scripts that are optimized for engagement and SEO. It's your in-house content strategy team, powered by AI.",
        price: 450000,
        image_url: 'https://picsum.photos/seed/contentai/600/400',
        is_best_seller: false,
        promo_price: 399000,
        promo_end_at: getFutureDate(15),
    }
];

export const MOCK_BANNERS: Banner[] = [
    {
        id: 1,
        image_url: 'https://picsum.photos/seed/banner1/1200/400',
        link_url: '#/checkout',
        sort_order: 1
    }
];

export const MOCK_VOUCHERS: Voucher[] = [
    {
        id: 1,
        code: "PINNVEO2",
        discount_type: VoucherDiscountType.FIXED,
        amount: 20000, // 170k - 150k = 20k discount
        min_amount: 170000,
        max_uses: 100,
        used_count: 0,
        valid_from: new Date().toISOString(),
        valid_to: getFutureDate(30),
        active: true,
    },
    {
        id: 2,
        code: "NEON10",
        discount_type: VoucherDiscountType.PERCENT,
        amount: 10,
        min_amount: 200000,
        max_uses: 50,
        used_count: 5,
        valid_from: null,
        valid_to: null,
        active: true,
    },
    {
        id: 3,
        code: "EXPIRED",
        discount_type: VoucherDiscountType.FIXED,
        amount: 50000,
        min_amount: 100000,
        max_uses: 0,
        used_count: 10,
        valid_from: "2020-01-01T00:00:00.000Z",
        valid_to: "2021-01-01T00:00:00.000Z",
        active: true,
    }
];
