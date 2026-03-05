import type {StorageSchemas} from "../../shared/repositories/storageSchemas.ts";
import type {StorageConnection} from "../../shared/repositories/storageConnection.ts";
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
        setValue(savedValue);
    });

    const updateValue = async (newValue: StorageSchemas[K]) => {
        setValue(newValue);
        await storageConnection.set(newValue);
    };

    return {
        value,
        updateValue,
    }
}