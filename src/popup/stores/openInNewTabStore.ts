import {createOptimisticUpdateStorageStore} from "@lib/sharedStorage/OptimisticUpdateStorageStore.ts";
import {createStorageConnection} from "@shared/storage/storage.ts";
import {openInNewTabDefaultValue, OpenInNewTabStorageSchema, STORAGE_KEYS} from "@shared/storage/storageSchemas.ts";

const openInNewTabStorageConnection = createStorageConnection(STORAGE_KEYS.OPEN_IN_NEW_TAB, OpenInNewTabStorageSchema, openInNewTabDefaultValue)

export const openInNewTabStore = createOptimisticUpdateStorageStore(openInNewTabStorageConnection.get, openInNewTabStorageConnection.set)
