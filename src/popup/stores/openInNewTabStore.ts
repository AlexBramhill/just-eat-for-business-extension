import {createStorageConnection} from "@lib/sharedStorage/storageConnection.ts";
import {openInNewTabDefaultValue, OpenInNewTabStorageSchema, STORAGE_KEYS} from "@lib/sharedStorage/storageSchemas.ts";
import {createSyncedStorageStore} from "@lib/sharedStorage/SyncedStorageStore.ts";

const openInNewTabStorageConnection = createStorageConnection(STORAGE_KEYS.OPEN_IN_NEW_TAB, OpenInNewTabStorageSchema, openInNewTabDefaultValue)

export const openInNewTabStore = createSyncedStorageStore(openInNewTabStorageConnection, openInNewTabDefaultValue)
