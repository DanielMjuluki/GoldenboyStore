import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string().trim().min(1, 'Product identifier is required'),
  quantity: z.number().int().positive('Quantity must be greater than zero'),
  size: z.string().trim().min(1).optional(),
  color: z.string().trim().min(1).optional(),
});

export const shippingAddressSchema = z.object({
  line1: z.string().trim().min(1, 'Street address is required'),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, 'City is required'),
  region: z.string().trim().min(1, 'State / region is required'),
  postalCode: z.string().trim().min(1, 'Postal code is required'),
  country: z.string().trim().min(1, 'Country is required'),
});

export const orderPayloadSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('A valid email address is required'),
  shippingAddress: shippingAddressSchema,
  items: z.array(orderItemSchema).min(1, 'At least one order item is required'),
  note: z.string().trim().max(500).optional(),
  paymentMethod: z.enum(['payfast', 'eft']).default('payfast'),
});

export type OrderPayload = z.infer<typeof orderPayloadSchema>;
