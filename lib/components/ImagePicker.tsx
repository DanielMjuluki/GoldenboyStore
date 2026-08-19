'use client';

import { useEffect, useState } from 'react';

interface ImageEntry {
  path: string;
  filename: string;
}

interface ImagePickerProps {
  adminKey: string;
  value: string;
  onChange: (path: string) => void;
  label: string;
}

export default function ImagePicker({ adminKey, value, onChange, label }: ImagePickerProps) {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!showPicker || images.length > 0) return;

    setLoading(true);
    fetch('/api/admin/product-images', {
      headers: { Authorization: `Bearer ${adminKey}` },
    })
      .then((res) => res.json())
      .then((data) => setImages(data.images ?? []))
      .catch((err) => console.error('Failed to load product images:', err))
      .finally(() => setLoading(false));
  }, [showPicker, images.length, adminKey]);

  return (
    <div className="form-field">
      <label>{label}</label>
      <div className="image-picker-row">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/mockup.jpg or pick from repo below"
        />
        <button type="button" className="button button-secondary" onClick={() => setShowPicker((s) => !s)}>
          {showPicker ? 'Hide' : 'Browse repo images'}
        </button>
      </div>

      {showPicker && (
        <div className="image-picker-grid">
          {loading && <p>Loading images…</p>}
          {!loading && images.length === 0 && <p>No images found in public/images/products yet.</p>}
          {images.map((img) => (
            <button
              key={img.path}
              type="button"
              className={`image-picker-thumb ${value === img.path ? 'selected' : ''}`}
              onClick={() => {
                onChange(img.path);
                setShowPicker(false);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.path} alt={img.filename} />
              <span>{img.filename}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
