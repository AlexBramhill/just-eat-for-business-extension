import { createStorageDefinitions } from '@lib/sharedStorage/storageDefinition.ts';
import { z } from 'zod';

export const STORAGE_KEYS = {
  OPEN_IN_NEW_TAB: 'openInNewTab',
  CART_CACHE: 'cartCache',
} as const;

export const OpenInNewTabStorageSchema = z.object({
  isEnabled: z.boolean(),
});

export const openInNewTabDefaultValue: OpenInNewTabStorage = {
  isEnabled: true,
};

export const CartCacheStorageItemSchema = z.object({
  orderId: z.string(),
  humanOrderId: z.number(),
});

export const CartCacheStorageSchema = z.object({
  date: z.coerce.date(),
  items: z.array(CartCacheStorageItemSchema),
});

export type OpenInNewTabStorage = z.infer<typeof OpenInNewTabStorageSchema>;
export type CartCacheStorageItem = z.infer<typeof CartCacheStorageItemSchema>;
export type CartCacheStorage = z.infer<typeof CartCacheStorageSchema>;

export const storageDefinitions = createStorageDefinitions([
  { key: STORAGE_KEYS.OPEN_IN_NEW_TAB, schema: OpenInNewTabStorageSchema },
  { key: STORAGE_KEYS.CART_CACHE, schema: CartCacheStorageSchema },
]);
