import {createStorageConnection} from "../../shared/repositories/storageConnection.ts";
import {type NewTabToggleStorage, STORAGE_KEYS} from "../../shared/repositories/storageSchemas.ts";
import {createSyncedStorageStore} from "./SyncedStorageStore.ts";

const newTabToggleDefaultValue: NewTabToggleStorage = {
    isEnabled: true
}
const newTabToggleStorageConnection = createStorageConnection(STORAGE_KEYS.NEW_TAB_TOGGLE, newTabToggleDefaultValue)

export const newTabToggleStore = createSyncedStorageStore(newTabToggleStorageConnection, newTabToggleDefaultValue)