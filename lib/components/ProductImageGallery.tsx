'use client';

import { useState } from 'react';

export default function ProductImageGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return <div className="product-image-placeholder">Image coming soon</div>;
  }

  return (
    <div className="product-gallery">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[activeIndex]} alt={name} className="product-image" />
      {images.length > 1 && (
        <div className="product-gallery-thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`product-gallery-thumb ${i === activeIndex ? 'product-gallery-thumb-active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Show image ${i + 1} of ${name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
