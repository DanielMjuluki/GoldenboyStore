'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ProductItem, CategoryItem } from '@/lib/data/types';
import { useCart } from '@/lib/components/CartContext';
import { formatPrice } from '@/lib/utils/currency';
import { ArrowRight, Zap, Search } from 'lucide-react';

interface ProductsExplorerProps {
  initialProducts: ProductItem[];
  initialCategories: CategoryItem[];
}

/**
 * Client-side search/filter/cart interactivity layer. Data itself is fetched
 * server-side (see app/products/page.tsx) and passed in as props, so the
 * first paint doesn't have to wait on a client -> /api/products round trip.
 */
export default function ProductsExplorer({ initialProducts, initialCategories }: ProductsExplorerProps) {
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
    const matchesCategory = selectedCategory === 'all' || product.categoryIds.includes(selectedCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="products-controls">
        <div className="search-bar">
          <Search className="w-5 h-5" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <button
            className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Services
          </button>
          {initialCategories.map((category) => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
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
                <div className="product-badge">
                  <Zap className="w-4 h-4" />
                  <span>Service</span>
                </div>
                {product.stockQuantity === null && (
                  <span className="availability-badge">Open for booking</span>
                )}
              </div>

              <h3 className="product-title">{product.name}</h3>
              <p className="product-description">{product.description}</p>

              <div className="product-meta">
                <div className="product-price">{formatPrice(product.priceCents, product.currency)}</div>
                {product.categoryIds.length > 0 && (
                  <div className="product-category">
                    {product.categoryIds.map((catId) => categoryMap.get(catId)?.name).join(', ')}
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
            <p>No services found matching your search.</p>
            <Link href="/products" className="button button-secondary">
              Clear filters
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
