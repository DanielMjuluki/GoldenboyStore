'use client';

import { useEffect, useState } from 'react';
import { Trash2, Pencil, X } from 'lucide-react';
import type { CategoryItem, ProductItem } from '@/lib/data/types';
import { formatPrice } from '@/lib/utils/currency';
import ImagePicker from '@/lib/components/ImagePicker';

const ADMIN_KEY_STORAGE = 'goldenboy_admin_key';

const emptyForm = {
  name: '',
  description: '',
  priceCents: 0,
  currency: 'ZAR',
  categoryIds: [] as string[],
  imageUrl1: '',
  imageUrl2: '',
  imageUrl3: '',
  sizes: '',
  colors: '',
  compareAtPrice: '',
  stockQuantity: null as number | null,
  status: 'active' as ProductItem['status'],
};

export default function AdminProductsPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) setAdminKey(stored);
  }, []);

  useEffect(() => {
    fetch('/api/products', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { categories: [] }))
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (adminKey) fetchProducts(adminKey);
  }, [adminKey]);

  const authHeaders = (key: string) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${key}`,
  });

  const fetchProducts = async (key: string) => {
    setLoadingProducts(true);
    try {
      const response = await fetch('/api/admin/products', { headers: authHeaders(key) });

      if (response.status === 401) {
        sessionStorage.removeItem(ADMIN_KEY_STORAGE);
        setAdminKey(null);
        setAuthError('That admin key was rejected. Please try again.');
        return;
      }

      if (!response.ok) throw new Error('Failed to load products');

      const data = await response.json();
      setProducts(data.products ?? []);
    } catch (error) {
      setMessage(`✗ ${error instanceof Error ? error.message : 'Failed to load products'}`);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const key = keyInput.trim();
    if (!key) return;

    try {
      const response = await fetch('/api/admin/products', { headers: authHeaders(key) });
      if (response.status === 401) {
        setAuthError('Incorrect admin key.');
        return;
      }
      if (!response.ok) throw new Error('Could not verify admin key');

      sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
      setAdminKey(key);
      setKeyInput('');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not verify admin key');
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey(null);
    setProducts([]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'priceCents') {
      setFormData({ ...formData, priceCents: Math.round(parseFloat(value || '0') * 100) });
    } else if (name === 'stockQuantity') {
      setFormData({ ...formData, stockQuantity: value === '' ? null : parseInt(value, 10) });
    } else if (name === 'status') {
      setFormData({ ...formData, status: value as ProductItem['status'] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => {
      const has = prev.categoryIds.includes(categoryId);
      return {
        ...prev,
        categoryIds: has
          ? prev.categoryIds.filter((id) => id !== categoryId)
          : [...prev.categoryIds, categoryId],
      };
    });
  };

  const startEdit = (product: ProductItem) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      priceCents: product.priceCents,
      currency: product.currency,
      categoryIds: product.categoryIds,
      imageUrl1: product.images[0] ?? '',
      imageUrl2: product.images[1] ?? '',
      imageUrl3: product.images[2] ?? '',
      sizes: (product.sizes ?? []).join(', '),
      colors: (product.colors ?? []).join(', '),
      compareAtPrice: product.compareAtPriceCents ? String(product.compareAtPriceCents / 100) : '',
      stockQuantity: product.stockQuantity,
      status: product.status,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey) return;

    setLoading(true);
    setMessage('');

    const { imageUrl1, imageUrl2, imageUrl3, sizes, colors, compareAtPrice, ...rest } = formData;
    const body = {
      ...rest,
      images: [imageUrl1, imageUrl2, imageUrl3].map((s) => s.trim()).filter(Boolean),
      sizes: sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: colors.split(',').map((s) => s.trim()).filter(Boolean),
      compareAtPriceCents: compareAtPrice.trim() ? Math.round(Number(compareAtPrice) * 100) : null,
    };

    try {
      const response = await fetch(
        editingId ? `/api/admin/products/${editingId}` : '/api/admin/products',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: authHeaders(adminKey),
          body: JSON.stringify(body),
        }
      );

      if (response.status === 401) {
        handleLock();
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save product');

      if (editingId) {
        setProducts((prev) => prev.map((p) => (p.id === editingId ? data.product : p)));
        setMessage('✓ Product updated successfully!');
      } else {
        setProducts((prev) => [...prev, data.product]);
        setMessage('✓ Product added successfully!');
      }

      cancelEdit();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!adminKey) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: authHeaders(adminKey),
      });

      if (response.status === 401) {
        handleLock();
        return;
      }

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      if (editingId === productId) cancelEdit();
      setMessage('✓ Product deleted');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (!adminKey) {
    return (
      <main className="page-shell">
        <section className="admin-section">
          <h1>Admin access</h1>
          <p>Enter your admin key to manage products.</p>
        </section>
        <section className="admin-form-wrapper">
          <form onSubmit={handleUnlock} className="admin-form">
            <div className="form-field">
              <label htmlFor="admin-key">Admin key</label>
              <input
                id="admin-key"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter admin key"
                autoFocus
                required
              />
            </div>
            <button type="submit" className="button button-primary">
              Unlock
            </button>
            {authError && <div className="alert error">{authError}</div>}
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="admin-section">
        <h1>Add Products</h1>
        <p>Upload t-shirts, hoodies, digital products, or services.</p>
        <button type="button" className="button button-secondary" onClick={handleLock}>
          Lock admin panel
        </button>
      </section>

      <section className="admin-form-wrapper">
        <form onSubmit={handleSubmit} className="admin-form">
          {editingId && (
            <div className="alert" style={{ background: 'rgba(245, 200, 66, 0.12)' }}>
              Editing "{formData.name}".{' '}
              <button type="button" className="btn-sm" onClick={cancelEdit} aria-label="Cancel edit">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="form-field">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Goldenboy Black T-Shirt"
              required
            />
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="What is this product?"
              rows={3}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                name="priceCents"
                value={formData.priceCents / 100 || ''}
                onChange={handleInputChange}
                placeholder="499.00"
                required
              />
            </div>
            <div className="form-field">
              <label>Currency</label>
              <select name="currency" value={formData.currency} onChange={handleInputChange}>
                <option value="ZAR">ZAR (South African Rand)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Stock (optional)</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity ?? ''}
                onChange={handleInputChange}
                placeholder="Leave blank for unlimited"
              />
            </div>
            <div className="form-field">
              <label>Categories</label>
              <div className="category-checkboxes">
                {categories.map((category) => (
                  <label key={category.id} className="category-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
              <p className="field-hint">
                Check a store section (e.g. Kingdome Fashion Apparel) and a product type (e.g. Merch) — a product can have both.
              </p>
              {categories.length === 0 && (
                <p className="field-hint">No categories found yet — check your data source.</p>
              )}
            </div>
          </div>

          <ImagePicker
            adminKey={adminKey ?? ''}
            value={formData.imageUrl1}
            onChange={(path) => setFormData({ ...formData, imageUrl1: path })}
            label="Image 1 (optional)"
          />

          <ImagePicker
            adminKey={adminKey ?? ''}
            value={formData.imageUrl2}
            onChange={(path) => setFormData({ ...formData, imageUrl2: path })}
            label="Image 2 (optional)"
          />

          <ImagePicker
            adminKey={adminKey ?? ''}
            value={formData.imageUrl3}
            onChange={(path) => setFormData({ ...formData, imageUrl3: path })}
            label="Image 3 (optional)"
          />
          <p className="field-hint">
            Up to 3 mockup images per product. Paste a URL, or browse images already in the repo.
          </p>

          <div className="form-field">
            <label>Sizes (optional, comma-separated)</label>
            <input
              type="text"
              name="sizes"
              value={formData.sizes}
              onChange={handleInputChange}
              placeholder="S, M, L"
            />
          </div>

          <div className="form-field">
            <label>Colours (optional, comma-separated)</label>
            <input
              type="text"
              name="colors"
              value={formData.colors}
              onChange={handleInputChange}
              placeholder="Black"
            />
            <p className="field-hint">
              Leave blank if this product has no size/colour options. Adding more colours later is just editing this field.
            </p>
          </div>

          <div className="form-field">
            <label>Compare-at price (optional, ZAR — the crossed-out original price)</label>
            <input
              type="number"
              step="0.01"
              name="compareAtPrice"
              value={formData.compareAtPrice}
              onChange={handleInputChange}
              placeholder="e.g. 350 if the sale price is 250"
            />
            <p className="field-hint">
              Leave blank for no discount badge. Must be higher than the actual price to show a strikethrough.
            </p>
          </div>

          <div className="form-field">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="active">Active (visible in store)</option>
              <option value="draft">Draft (hidden)</option>
              <option value="inactive">Inactive (hidden)</option>
            </select>
          </div>

          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? 'Saving...' : editingId ? 'Save changes' : '+ Add Product'}
          </button>

          {message && (
            <div className={`alert ${message.startsWith('✓') ? 'success' : 'error'}`}>{message}</div>
          )}
        </form>
      </section>

      <section className="admin-products-section">
        <h2>Your Store</h2>
        {loadingProducts ? (
          <p className="empty">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="empty">No products yet.</p>
        ) : (
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.images[0]}
                          alt=""
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      ) : (
                        <span className="field-hint">No image</span>
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>{formatPrice(p.priceCents, p.currency)}</td>
                    <td>{p.stockQuantity ?? '∞'}</td>
                    <td>{p.status}</td>
                    <td>
                      <button className="btn-sm" onClick={() => startEdit(p)} aria-label={`Edit ${p.name}`} style={{ marginRight: '0.5rem', background: 'rgba(245, 200, 66, 0.15)', borderColor: 'rgba(245, 200, 66, 0.3)', color: '#f5c842' }}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="btn-sm" onClick={() => handleDelete(p.id)} aria-label={`Delete ${p.name}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
