import { NextRequest, NextResponse } from 'next/server';
import { readdirSync, statSync } from 'fs';
import path from 'path';
import { isAuthorizedAdminRequest, unauthorizedAdminResponseInit } from '@/lib/utils/adminAuth';
import { logError } from '@/lib/utils/logging';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

interface ImageEntry {
  path: string;
  filename: string;
}

// Recursively walks public/images/products, returning every image file found
// along with its web-accessible path (e.g. /images/products/kingdome-apparel/hoodies/foo.png).
function walkImages(dir: string, baseDir: string): ImageEntry[] {
  const entries: ImageEntry[] = [];
  let items: string[];

  try {
    items = readdirSync(dir);
  } catch {
    return entries;
  }

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      entries.push(...walkImages(fullPath, baseDir));
    } else if (IMAGE_EXTENSIONS.includes(path.extname(item).toLowerCase())) {
      const relativePath = path.relative(baseDir, fullPath).split(path.sep).join('/');
      entries.push({ path: `/images/products/${relativePath}`, filename: item });
    }
  }

  return entries;
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, unauthorizedAdminResponseInit());
  }

  try {
    const productsImagesDir = path.join(process.cwd(), 'public', 'images', 'products');
    const images = walkImages(productsImagesDir, productsImagesDir);
    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    logError('Failed to list product images', error);
    return NextResponse.json({ error: 'Failed to list product images' }, { status: 500 });
  }
}
