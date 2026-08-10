'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ProductItem, CategoryItem } from '@/lib/data/types';
import { useCart } from '@/lib/components/CartContext';
import { formatPrice } from '@/lib/utils/currency';
import { ArrowRight, Search } from 'lucide-react';

interface ProductsExplorerProps {
  initialProducts: ProductItem[];
  initialCategories: CategoryItem[];
}

const STORE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'general-store', label: 'Golden General Store' },
  { id: 'kingdome-apparel', label: 'Kingdome Fashion Apparel' },
  { id: 'goldenboy-merch', label: 'Goldenboy Merch' },
];

export default function ProductsExplorer({ initialProducts, initialCategories }: ProductsExplorerProps) {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { addItem } = useCart();

  const handleAdd = (productId: string) => {
    addItem(productId, 1);
    router.push('/cart');
  };

  const categoryMap = new Map(initialCategories.map((category) => [category.id, category]));

  const filteredProducts = initialProducts.filter((product) => {
    const matchesTab = selectedTab === 'all' || product.categoryIds.includes(selectedTab);
    const matchesCategory = selectedCategory === 'all' || product.categoryIds.includes(selectedCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="store-tabs" role="tablist" aria-label="Store sections">
        {STORE_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`filter-btn ${selectedTab === tab.id ? 'active' : ''}`}
            onClick={() => setSelectedTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="products-controls">
        <div className="search-bar">
          <Search className="w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Products</option>
            {initialCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              {product.images.length > 0 && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0]} alt={product.name} className="product-card-image" />
              )}
              <div className="product-card-header">
                {product.stockQuantity === null ? (
                  <span className="availability-badge">Always in stock</span>
                ) : product.stockQuantity > 0 ? (
                  <span className="availability-badge">{product.stockQuantity} in stock</span>
                ) : (
                  <span className="availability-badge">Sold out</span>
                )}
              </div>

              <h3 className="product-title">{product.name}</h3>
              <p className="product-description">{product.description}</p>

              <div className="product-meta">
                <div className="product-price">{formatPrice(product.priceCents, product.currency)}</div>
                {product.categoryIds.length > 0 && (
                  <div className="product-category">
                    {product.categoryIds.map((catId) => categoryMap.get(catId)?.name).filter(Boolean).join(', ')}
                  </div>
                )}
              </div>

              <div className="product-actions">
                <Link href={`/products/${product.id}`} className="product-link">
                  View details <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="product-btn" onClick={() => handleAdd(product.id)}>
                  Add to cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products found matching your search.</p>
            <Link href="/products" className="button button-secondary">
              Clear filters
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
