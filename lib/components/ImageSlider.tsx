'use client';

import { useState } from 'react';
import Image from 'next/image';

type SliderImage = {
  src: string;
  alt: string;
};

export function ImageSlider({
  images,
  aspectRatio = '4 / 5',
}: {
  images: SliderImage[];
  aspectRatio?: string;
}) {
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;

  function prev() {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }
  function next() {
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  if (images.length === 0) return null;

  return (
    <div className="is-wrap">
      <style>{`
        .is-wrap {
          position: relative;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
        }
        .is-frame {
          position: relative;
          width: 100%;
          aspect-ratio: ${aspectRatio};
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid var(--border);
          background: var(--overlay-03);
        }
        .is-frame img {
          object-fit: cover;
        }
        .is-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.55);
          border: none;
          color: #fff;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }
        .is-arrow.left { left: 10px; }
        .is-arrow.right { right: 10px; }
        .is-dots {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
        }
        .is-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--overlay-16);
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .is-dot.active {
          background: var(--accent);
        }
      `}</style>

      <div className="is-frame">
        <Image
          src={images[index].src}
          alt={images[index].alt}
          fill
          sizes="380px"
          priority={index === 0}
        />
        {hasMultiple && (
          <>
            <button type="button" className="is-arrow left" onClick={prev} aria-label="Previous image">
              ‹
            </button>
            <button type="button" className="is-arrow right" onClick={next} aria-label="Next image">
              ›
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="is-dots">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={`is-dot${i === index ? ' active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
