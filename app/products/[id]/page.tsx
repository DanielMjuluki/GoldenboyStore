import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { dataStore } from '@/lib/data';
import { formatPrice } from '@/lib/utils/currency';
import ProductDetailActions from '@/lib/components/ProductDetailActions';
import ProductImageGallery from '@/lib/components/ProductImageGallery';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await dataStore.getProductById(params.id);

  if (!product || product.status !== 'active') {
    return { title: 'Product not found' };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      images: product.images.length > 0 ? product.images : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await dataStore.getProductById(params.id);

  if (!product || product.status !== 'active') {
    return notFound();
  }

  // Structured data helps search engines show rich results (price,
  // availability) directly in search listings.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    ...(product.images.length > 0 && { image: product.images }),
    offers: {
      '@type': 'Offer',
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.stockQuantity === null || product.stockQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="page-heading">
        <div>
          <p className="eyebrow">Product details</p>
          <h1>{product.name}</h1>
          <p className="intro-copy">
            Check sizing, availability, and pricing before you add it to your cart.
          </p>
        </div>
        <div className="page-actions">
          <Link href="/products" className="button button-secondary">
            Back to shop
          </Link>
        </div>
      </section>

      <section className="product-detail-grid">
        <div className="product-detail-card">
          <ProductImageGallery images={product.images} name={product.name} />
          <div className="product-detail-copy">
            <h2>What you get</h2>
            <p>{product.description}</p>
            <dl>
              <dt>Price</dt>
              <dd>{formatPrice(product.priceCents, product.currency)}</dd>
              <dt>Availability</dt>
              <dd>{product.stockQuantity === null ? 'Always in stock' : `${product.stockQuantity} available`}</dd>
              <dt>Category</dt>
              <dd>{product.categoryIds.length > 0 ? product.categoryIds.join(', ') : 'General'}</dd>
            </dl>
          </div>
        </div>

        <ProductDetailActions product={product} />
      </section>
    </main>
  );
}
