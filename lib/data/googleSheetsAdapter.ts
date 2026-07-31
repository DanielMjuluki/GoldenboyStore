import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import { randomUUID } from 'crypto';
import type { DataStore, ProductInput, ProductUpdate } from './repository';
import type { CategoryItem, OrderPayload, OrderRecord, ProductItem } from './types';

const PRODUCTS_SHEET_NAME = 'products';
const CATEGORIES_SHEET_NAME = 'categories';
const ORDERS_SHEET_NAME = 'orders';

function normalizeHeaders(headerRow: unknown[]): string[] {
  return headerRow.map((header) => String(header ?? '').trim().toLowerCase());
}

function parseSheetRows(rows: unknown[][]) {
  const headers = normalizeHeaders(rows[0] ?? []);
  return rows.slice(1).map((row) => {
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = String(row[index] ?? '').trim();
      return acc;
    }, {});
  });
}

function parseProduct(row: Record<string, string>): ProductItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    priceCents: Number(row.price_cents ?? '0'),
    currency: row.currency || 'ZAR',
    categoryIds: row.category_ids
      ? row.category_ids.split(',').map((value) => value.trim()).filter(Boolean)
      : [],
    // Pipe-separated rather than comma-separated, since URLs can
    // legitimately contain commas (e.g. in query strings).
    images: row.images
      ? row.images.split('|').map((value) => value.trim()).filter(Boolean)
      : [],
    sizes: row.sizes
      ? row.sizes.split(',').map((value) => value.trim()).filter(Boolean)
      : [],
    colors: row.colors
      ? row.colors.split(',').map((value) => value.trim()).filter(Boolean)
      : [],
    stockQuantity: row.stock_quantity === '' ? null : Number(row.stock_quantity),
    status: (row.status as ProductItem['status']) || 'active',
  };
}

function parseCategory(row: Record<string, string>): CategoryItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
  };
}

function parseOrder(row: Record<string, string>): OrderRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    payload: {
      name: row.customer_name,
      email: row.customer_email,
      shippingAddress: JSON.parse(row.shipping_address_json || '{}'),
      items: JSON.parse(row.items_json || '[]'),
      note: row.notes || undefined,
    },
    status: (row.status as OrderRecord['status']) || 'pending_payment',
  };
}

// The service account JSON is expected to contain `client_email` and
// `private_key` at minimum (what GoogleAuth's `credentials` option needs),
// but is typed loosely here since it comes from a runtime JSON.parse
// (see resolveServiceAccountAuth in index.ts) and TypeScript can't verify
// its shape at compile time.
type ServiceAccountCredentials = Record<string, unknown>;

export class GoogleSheetsDataStore implements DataStore {
  /**
   * `serviceAccountAuth` is either:
   *  - a filesystem path to a service account JSON key (works locally, where
   *    the file persists on disk), or
   *  - the parsed JSON credentials object directly (works on serverless
   *    hosts like Vercel, which have no persistent filesystem to point a
   *    path at — see `resolveServiceAccountAuth` in index.ts, which decodes
   *    GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 into this form).
   */
  constructor(
    private sheetId: string,
    private serviceAccountAuth: string | ServiceAccountCredentials
  ) {}

  private async getSheetsClient() {
    const auth =
      typeof this.serviceAccountAuth === 'string'
        ? new google.auth.GoogleAuth({
            keyFile: this.serviceAccountAuth,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          })
        : new google.auth.GoogleAuth({
            credentials: this.serviceAccountAuth,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
          });

    return google.sheets({ version: 'v4', auth });
  }

  private async readRows(range: string) {
    const sheets = await this.getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range,
    });

    return (response.data.values ?? []) as unknown[][];
  }

  async getActiveProducts(): Promise<ProductItem[]> {
    const products = await this.getAllProducts();
    return products.filter((product) => product.status === 'active');
  }

  async getProductById(productId: string): Promise<ProductItem | null> {
    const products = await this.getAllProducts();
    return products.find((product) => product.id === productId) ?? null;
  }

  async getCategories(): Promise<CategoryItem[]> {
    const rows = await this.readRows(`${CATEGORIES_SHEET_NAME}!A:C`);
    if (rows.length === 0) return [];
    return parseSheetRows(rows).map(parseCategory);
  }

  private orderToRow(record: OrderRecord): (string | number)[] {
    return [
      record.id,
      record.createdAt,
      record.payload.name,
      record.payload.email,
      JSON.stringify(record.payload.shippingAddress),
      JSON.stringify(record.payload.items),
      record.status,
      record.payload.note ?? '',
      '', // reserved column (previously stripe_session_id) — kept blank so existing sheets don't need a column removed
    ];
  }

  async createOrder(payload: OrderPayload): Promise<OrderRecord> {
    const record: OrderRecord = {
      id: `order_${randomUUID()}`,
      createdAt: new Date().toISOString(),
      payload,
      status: 'pending_payment',
    };

    const sheets = await this.getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: this.sheetId,
      range: `${ORDERS_SHEET_NAME}!A:I`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.orderToRow(record)],
      },
    });

    return record;
  }

  async findOrderById(orderId: string): Promise<OrderRecord | null> {
    const rows = await this.readRows(`${ORDERS_SHEET_NAME}!A:I`);
    if (rows.length === 0) return null;

    const records = parseSheetRows(rows).map(parseOrder);
    return records.find((order) => order.id === orderId) ?? null;
  }

  private async findOrderRowNumber(orderId: string): Promise<number | null> {
    const rows = await this.readRows(`${ORDERS_SHEET_NAME}!A:I`);
    if (rows.length === 0) return null;

    const headers = normalizeHeaders(rows[0]);
    const idColumn = headers.indexOf('id');
    if (idColumn === -1) return null;

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][idColumn] ?? '').trim() === orderId) {
        return i + 1;
      }
    }

    return null;
  }

  async updateOrder(
    orderId: string,
    updates: Partial<Pick<OrderRecord, 'status'>>
  ): Promise<OrderRecord | null> {
    const [rowNumber, existing] = await Promise.all([
      this.findOrderRowNumber(orderId),
      this.findOrderById(orderId),
    ]);

    if (rowNumber === null || !existing) return null;

    const updated: OrderRecord = { ...existing, ...updates };

    const sheets = await this.getSheetsClient();
    await sheets.spreadsheets.values.update({
      spreadsheetId: this.sheetId,
      range: `${ORDERS_SHEET_NAME}!A${rowNumber}:I${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.orderToRow(updated)],
      },
    });

    return updated;
  }

  async decrementStockForOrder(items: Array<{ productId: string; quantity: number }>): Promise<void> {
    const products = await this.getAllProducts();

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product || product.stockQuantity === null) continue;

      const newQuantity = Math.max(0, product.stockQuantity - item.quantity);
      await this.updateProduct(item.productId, { stockQuantity: newQuantity });
    }
  }

  async getAllProducts(): Promise<ProductItem[]> {
    const rows = await this.readRows(`${PRODUCTS_SHEET_NAME}!A:K`);
    if (rows.length === 0) return [];
    return parseSheetRows(rows)
      .map(parseProduct)
      .filter((product) => Boolean(product.id));
  }

  private productToRow(product: ProductItem): (string | number)[] {
    return [
      product.id,
      product.name,
      product.description,
      String(product.priceCents),
      product.currency,
      product.categoryIds.join(','),
      product.images.join('|'),
      product.stockQuantity === null ? '' : String(product.stockQuantity),
      product.status,
      (product.sizes ?? []).join(','),
      (product.colors ?? []).join(','),
    ];
  }

  /**
   * Finds the 1-based sheet row number for a product by id, by scanning the
   * `id` column. Returns null if the product/sheet is not found.
   */
  private async findProductRowNumber(productId: string): Promise<number | null> {
    const rows = await this.readRows(`${PRODUCTS_SHEET_NAME}!A:K`);
    if (rows.length === 0) return null;

    const headers = normalizeHeaders(rows[0]);
    const idColumn = headers.indexOf('id');
    if (idColumn === -1) return null;

    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][idColumn] ?? '').trim() === productId) {
        return i + 1; // +1 to convert 0-based array index to 1-based sheet row
      }
    }

    return null;
  }

  private async getSheetGidByName(sheetName: string): Promise<number> {
    const sheets = await this.getSheetsClient();
    const meta = await sheets.spreadsheets.get({ spreadsheetId: this.sheetId });
    const sheet = meta.data.sheets?.find((s) => s.properties?.title === sheetName);

    if (!sheet || sheet.properties?.sheetId == null) {
      throw new Error(`Sheet "${sheetName}" was not found in this spreadsheet`);
    }

    return sheet.properties.sheetId;
  }

  async createProduct(input: ProductInput): Promise<ProductItem> {
    const id = input.id?.trim() || `prod_${randomUUID()}`;

    const existingProducts = await this.getAllProducts();
    if (existingProducts.some((product) => product.id === id)) {
      throw new Error(`A product with id "${id}" already exists`);
    }

    const product: ProductItem = {
      id,
      name: input.name,
      description: input.description,
      priceCents: input.priceCents,
      currency: input.currency,
      categoryIds: input.categoryIds,
      images: input.images,
      stockQuantity: input.stockQuantity,
      status: input.status,
    };

    const sheets = await this.getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: this.sheetId,
      range: `${PRODUCTS_SHEET_NAME}!A:K`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.productToRow(product)],
      },
    });

    return product;
  }

  async updateProduct(productId: string, updates: ProductUpdate): Promise<ProductItem | null> {
    const [rowNumber, existingProducts] = await Promise.all([
      this.findProductRowNumber(productId),
      this.getAllProducts(),
    ]);

    const existing = existingProducts.find((product) => product.id === productId);
    if (rowNumber === null || !existing) return null;

    const updated: ProductItem = { ...existing, ...updates, id: productId };

    const sheets = await this.getSheetsClient();
    await sheets.spreadsheets.values.update({
      spreadsheetId: this.sheetId,
      range: `${PRODUCTS_SHEET_NAME}!A${rowNumber}:K${rowNumber}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [this.productToRow(updated)],
      },
    });

    return updated;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const rowNumber = await this.findProductRowNumber(productId);
    if (rowNumber === null) return false;

    const sheets = await this.getSheetsClient();
    const sheetGid = await this.getSheetGidByName(PRODUCTS_SHEET_NAME);

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.sheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetGid,
                dimension: 'ROWS',
                startIndex: rowNumber - 1, // 0-based, inclusive
                endIndex: rowNumber, // 0-based, exclusive
              },
            },
          },
        ],
      },
    });

    return true;
  }
}
