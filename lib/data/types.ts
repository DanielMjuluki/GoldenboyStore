export type ProductStatus = 'active' | 'inactive' | 'draft';

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  categoryIds: string[];
  images: string[];
  stockQuantity: number | null;
  status: ProductStatus;
  sizes?: string[];
  colors?: string[];
  compareAtPriceCents?: number | null;
}

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
}

export interface OrderPayload {
  email: string;
  name: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  items: Array<{ productId: string; quantity: number; size?: string; color?: string }>;
  note?: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  payload: OrderPayload;
  status: 'pending_payment' | 'paid' | 'payment_failed' | 'fulfilled' | 'cancelled';
}

export type ProductType = 'service' | 'physical-product' | 'software' | 'digital';

export interface ProductItemExtended extends ProductItem {
  type: ProductType;
  features?: string[];
  deliveryTime?: string;
  recurring?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: 'business' | 'media' | 'development' | 'brand';
  date: string;
  image?: string;
  link?: string;
  tags: string[];
  status: 'active' | 'completed' | 'ongoing';
}

export interface SocialMediaStats {
  platform: 'youtube' | 'tiktok' | 'facebook' | 'kick';
  followers: number;
  verified: boolean;
  handle: string;
  lastUpdated: string;
}

export interface BrandStats {
  totalFollowers: number;
  totalViewers: number;
  brandDeals: number;
  platforms: number;
  socialMedia: SocialMediaStats[];
  lastSynced: string;
}
