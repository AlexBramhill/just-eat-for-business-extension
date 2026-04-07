import {createStorageConnection} from "../../shared/repositories/storageConnection.ts";
import {
    openInNewTabDefaultValue,
    OpenInNewTabStorageSchema,
    STORAGE_KEYS
} from "../../shared/repositories/storageSchemas.ts";
import {createSyncedStorageStore} from "./SyncedStorageStore.ts";

const openInNewTabStorageConnection = createStorageConnection(STORAGE_KEYS.OPEN_IN_NEW_TAB, OpenInNewTabStorageSchema, openInNewTabDefaultValue)

export const openInNewTabStore = createSyncedStorageStore(openInNewTabStorageConnection, openInNewTabDefaultValue)
