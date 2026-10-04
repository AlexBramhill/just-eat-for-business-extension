import { createStorageConnection } from '@shared/storage/storage.ts';
import { STORAGE_KEYS } from '@shared/storage/storageDefinitions.ts';

export const cacheStore = createStorageConnection(STORAGE_KEYS.CART_CACHE);
