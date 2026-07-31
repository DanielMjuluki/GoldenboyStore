import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data';
import { productPayloadSchema } from '@/lib/validation/product';
import { isAuthorizedAdminRequest, unauthorizedAdminResponseInit } from '@/lib/utils/adminAuth';
import { logError } from '@/lib/utils/logging';

export async function GET(request: NextRequest) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, unauthorizedAdminResponseInit());
  }

  try {
    const products = await dataStore.getAllProducts();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    logError('Failed to fetch admin products', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, unauthorizedAdminResponseInit());
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    logError('Failed to parse admin product JSON', error);
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const validation = productPayloadSchema.safeParse(payload);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Product validation failed.', issues: validation.error.format() },
      { status: 422 }
    );
  }

  try {
    const product = await dataStore.createProduct(validation.data);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    logError('Failed to create product', error);
    const message = error instanceof Error ? error.message : 'Failed to create product';
    // Duplicate-id errors are a client mistake (409), everything else is a server error.
    const status = message.includes('already exists') ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
