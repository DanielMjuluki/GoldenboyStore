'use client';

import { useState, FormEvent } from 'react';

interface CheckoutFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
  initialItems?: { productId: string; quantity: number }[];
}

export default function CheckoutForm({ onSubmit, isLoading, initialItems = [] }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    shippingAddress: {
      line1: '',
      line2: '',
      city: '',
      region: '',
      postalCode: '',
      country: '',
    },
    items: initialItems.length > 0 ? initialItems : [{ productId: 'sample_1', quantity: 1 }],
    note: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('address_')) {
      const fieldName = name.replace('address_', '');
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <fieldset disabled={isLoading}>
        <div className="form-section">
          <legend>Contact Information</legend>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="form-section">
          <legend>Shipping Address</legend>
          <div className="form-group">
            <label htmlFor="line1">Street Address *</label>
            <input
              id="line1"
              type="text"
              name="address_line1"
              value={formData.shippingAddress.line1}
              onChange={handleChange}
              required
              placeholder="123 Main St"
            />
          </div>
          <div className="form-group">
            <label htmlFor="line2">Apartment / Suite (Optional)</label>
            <input
              id="line2"
              type="text"
              name="address_line2"
              value={formData.shippingAddress.line2}
              onChange={handleChange}
              placeholder="Apt 4B"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                id="city"
                type="text"
                name="address_city"
                value={formData.shippingAddress.city}
                onChange={handleChange}
                required
                placeholder="New York"
              />
            </div>
            <div className="form-group">
              <label htmlFor="region">State / Region *</label>
              <input
                id="region"
                type="text"
                name="address_region"
                value={formData.shippingAddress.region}
                onChange={handleChange}
                required
                placeholder="NY"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code *</label>
              <input
                id="postalCode"
                type="text"
                name="address_postalCode"
                value={formData.shippingAddress.postalCode}
                onChange={handleChange}
                required
                placeholder="10001"
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                id="country"
                type="text"
                name="address_country"
                value={formData.shippingAddress.country}
                onChange={handleChange}
                required
                placeholder="United States"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <legend>Additional Notes (Optional)</legend>
          <div className="form-group">
            <label htmlFor="note">Order Notes</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Any special instructions for your order..."
              maxLength={500}
            />
            <p className="char-count">{formData.note.length} / 500</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="button button-primary" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
