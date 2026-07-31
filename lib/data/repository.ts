import type { CategoryItem, OrderPayload, OrderRecord, ProductItem } from './types';

export type ProductInput = Omit<ProductItem, 'id'> & { id?: string };
export type ProductUpdate = Partial<Omit<ProductItem, 'id'>>;

export interface DataStore {
  getActiveProducts(): Promise<ProductItem[]>;
  getProductById(productId: string): Promise<ProductItem | null>;
  getCategories(): Promise<CategoryItem[]>;
  createOrder(payload: OrderPayload): Promise<OrderRecord>;
  findOrderById(orderId: string): Promise<OrderRecord | null>;
  updateOrder(
    orderId: string,
    updates: Partial<Pick<OrderRecord, 'status'>>
  ): Promise<OrderRecord | null>;
  /**
   * Decrements stock for finite-stock items after a successful payment.
   * Items with unlimited stock (null) are left untouched.
   */
  decrementStockForOrder(items: Array<{ productId: string; quantity: number }>): Promise<void>;

  // Admin / inventory management. These operate on the full catalog
  // (including inactive/draft items), not just the public-facing active list.
  getAllProducts(): Promise<ProductItem[]>;
  createProduct(product: ProductInput): Promise<ProductItem>;
  updateProduct(productId: string, updates: ProductUpdate): Promise<ProductItem | null>;
  deleteProduct(productId: string): Promise<boolean>;
}
