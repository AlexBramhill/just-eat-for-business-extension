export const STORAGE_KEYS = {
    NEW_TAB_TOGGLE: "newTabToggle",
    CART_CACHE: "cartCache",
} as const;

export const newTabToggleDefaultValue: NewTabToggleStorage = {
    isEnabled: true
}

export type NewTabToggleStorage = {
    isEnabled: boolean;
};

export type CartCacheStorageItem = {
    orderId: string;
    humanOrderId: number;
}

export type CartCacheStorage = {
    date: Date;
    items: CartCacheStorageItem[];
}
export type StorageSchemas = {
    [STORAGE_KEYS.NEW_TAB_TOGGLE]: NewTabToggleStorage,
    [STORAGE_KEYS.CART_CACHE]: CartCacheStorage
}