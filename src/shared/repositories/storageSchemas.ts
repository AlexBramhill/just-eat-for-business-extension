import {z} from "zod";

export const STORAGE_KEYS = {
    NEW_TAB_TOGGLE: "newTabToggle",
    CART_CACHE: "cartCache",
} as const;

export const NewTabToggleStorageSchema = z.object({
    isEnabled: z.boolean(),
});

export const newTabToggleDefaultValue: NewTabToggleStorage = {
    isEnabled: true
}

export const CartCacheStorageItemSchema = z.object({
    orderId: z.string(),
    humanOrderId: z.number(),
});

export const CartCacheStorageSchema = z.object({
    date: z.coerce.date(),
    items: z.array(CartCacheStorageItemSchema),
});

export const StorageSchemasSchema = z.object({
    [STORAGE_KEYS.NEW_TAB_TOGGLE]: NewTabToggleStorageSchema,
    [STORAGE_KEYS.CART_CACHE]: CartCacheStorageSchema,
});

export type NewTabToggleStorage = z.infer<typeof NewTabToggleStorageSchema>;
export type CartCacheStorageItem = z.infer<typeof CartCacheStorageItemSchema>;
export type CartCacheStorage = z.infer<typeof CartCacheStorageSchema>;
export type StorageSchemas = z.infer<typeof StorageSchemasSchema>;
