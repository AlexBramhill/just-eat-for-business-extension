import {createOptimisticUpdateStorageStore} from "@lib/sharedStorage/OptimisticUpdateStorageStore.ts";
import {createStorageConnection} from "@shared/storage/storage.ts";
import {openInNewTabDefaultValue, STORAGE_KEYS} from "@shared/storage/storageDefinitions.ts";

const openInNewTabStorageConnection = createStorageConnection(STORAGE_KEYS.OPEN_IN_NEW_TAB, openInNewTabDefaultValue)

export const openInNewTabStore = createOptimisticUpdateStorageStore(openInNewTabStorageConnection)
