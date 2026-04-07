import {createStorageConnection} from "../../shared/repositories/storageConnection.ts";
import {
    newTabToggleDefaultValue,
    NewTabToggleStorageSchema,
    STORAGE_KEYS
} from "../../shared/repositories/storageSchemas.ts";
import {createSyncedStorageStore} from "./SyncedStorageStore.ts";

const newTabToggleStorageConnection = createStorageConnection(STORAGE_KEYS.NEW_TAB_TOGGLE, NewTabToggleStorageSchema, newTabToggleDefaultValue)

export const newTabToggleStore = createSyncedStorageStore(newTabToggleStorageConnection, newTabToggleDefaultValue)