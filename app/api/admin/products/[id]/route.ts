import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data';
import type { ProductUpdate } from '@/lib/data/repository';
import { productUpdateSchema } from '@/lib/validation/product';
import { isAuthorizedAdminRequest, unauthorizedAdminResponseInit } from '@/lib/utils/adminAuth';
import { logError } from '@/lib/utils/logging';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, unauthorizedAdminResponseInit());
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const deleted = await dataStore.deleteProduct(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    logError('Failed to delete product', error, { productId: id });
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, unauthorizedAdminResponseInit());
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    logError('Failed to parse admin product update JSON', error, { productId: id });
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const validation = productUpdateSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Product validation failed.', issues: validation.error.format() },
      { status: 422 }
    );
  }

  // productUpdateSchema is built with .partial(), so Zod includes every
  // unset field as an explicit `undefined` in validation.data. Strip those
  // out before merging, otherwise spreading them over the existing product
  // would blank out fields the client never intended to touch.
  const updates: ProductUpdate = {};
  for (const [key, value] of Object.entries(validation.data)) {
    if (value !== undefined) {
      (updates as Record<string, unknown>)[key] = value;
    }
  }

  try {
    const updated = await dataStore.updateProduct(id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated }, { status: 200 });
  } catch (error) {
    logError('Failed to update product', error, { productId: id });
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
