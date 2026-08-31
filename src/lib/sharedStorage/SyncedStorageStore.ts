import type {StorageConnection} from "@lib/sharedStorage/storageConnection.ts";
import type {StorageSchemas} from "@lib/sharedStorage/storageSchemas.ts";
import {logger} from "@shared/logger.ts";
import {onMount} from "solid-js";
import {createStore} from "solid-js/store";

export type SyncedStorageStore<K extends keyof StorageSchemas> = {
    value: StorageSchemas[K];
    updateValue: (newValue: StorageSchemas[K]) => void;
};

export const createSyncedStorageStore = <K extends keyof StorageSchemas>(
    storageConnection: StorageConnection<K>,
    defaultValue: StorageSchemas[K],
): SyncedStorageStore<K> => {
    const [value, setValue] = createStore<StorageSchemas[K]>(defaultValue);

    onMount(async () => {
        const savedValue = await storageConnection.get();
        logger.debug({value: savedValue}, "SyncedStorageStore: loaded initial value");
        setValue(savedValue);
    });

    const updateValue = async (newValue: StorageSchemas[K]) => {
        logger.debug({newValue}, "SyncedStorageStore: updateValue");
        setValue(newValue);
        await storageConnection.set(newValue);
    };

    return {
        value,
        updateValue,
    }
}