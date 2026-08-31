import {createStorageConnection} from "@shared/storage/storage.ts";
import {type CartCacheStorage, CartCacheStorageSchema, STORAGE_KEYS} from "@shared/storage/storageSchemas.ts";

const cartCacheDefault: CartCacheStorage = {
    date: new Date(0),
    items: []
}

export const cacheStore = createStorageConnection(STORAGE_KEYS.CART_CACHE, CartCacheStorageSchema, cartCacheDefault)
