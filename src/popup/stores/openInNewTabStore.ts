import {createStorageConnection} from "@lib/sharedStorage/storageConnection.ts";
import {createSyncedStorageStore} from "@lib/sharedStorage/SyncedStorageStore.ts";
import {openInNewTabDefaultValue, OpenInNewTabStorageSchema, STORAGE_KEYS} from "@shared/storage/storageSchemas.ts";

const openInNewTabStorageConnection = createStorageConnection(STORAGE_KEYS.OPEN_IN_NEW_TAB, OpenInNewTabStorageSchema, openInNewTabDefaultValue)

export const openInNewTabStore = createSyncedStorageStore(openInNewTabStorageConnection, openInNewTabDefaultValue)
