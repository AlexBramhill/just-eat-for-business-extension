import {createStorageConnection} from "@lib/sharedStorage/storageConnection.ts";
import {type CartCacheStorage, CartCacheStorageSchema, STORAGE_KEYS} from "@lib/sharedStorage/storageSchemas.ts";

const cartCacheDefault: CartCacheStorage = {
    date: new Date(0),
    items: []
}

export const cacheStore = createStorageConnection(STORAGE_KEYS.CART_CACHE, CartCacheStorageSchema, cartCacheDefault)
