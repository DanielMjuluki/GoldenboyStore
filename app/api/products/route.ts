import { NextResponse } from 'next/server';
import { dataStore } from '../../../lib/data';

// Force this route to run fresh on every request instead of being
// statically frozen at build time — otherwise sheet edits (new
// categories, renamed ones, stock changes) never show up until the
// next deploy, no matter how long you wait or reload.
export const dynamic = 'force-dynamic';

// Product/category data changes infrequently. Allow short edge/browser
// caching with background revalidation so repeat visits (cart, checkout,
// products page) don't all force a fresh data-store hit.
const CACHE_CONTROL = 'public, max-age=30, stale-while-revalidate=120';

export async function GET() {
  try {
    const products = await dataStore.getActiveProducts();
    const categories = await dataStore.getCategories();

    return NextResponse.json(
      { products, categories },
      { status: 200, headers: { 'Cache-Control': CACHE_CONTROL } }
    );
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
