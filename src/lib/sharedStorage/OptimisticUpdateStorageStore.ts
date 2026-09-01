import type {StorageConnection} from "@lib/sharedStorage/storageConnection.ts";
import {logger} from "@shared/logger.ts";
import {onMount} from "solid-js";
import {createStore} from "solid-js/store";

export type OptimisticUpdateStorageStore<K extends object> = {
    value: K | undefined;
    updateValue: (newValue: K) => void;
};

export function createOptimisticUpdateStorageStore<K extends object>(
    storageConnection: StorageConnection<K>
): OptimisticUpdateStorageStore<K>;

export function createOptimisticUpdateStorageStore<K extends object>(
    getValue: () => Promise<K>,
    setPersistedValue: (newValue: K) => void,
): OptimisticUpdateStorageStore<K>;

export function createOptimisticUpdateStorageStore<K extends object>(
    storageConnectionOrGetValue: StorageConnection<K> | (() => Promise<K>),
    setPersistedValue?: (newValue: K) => void,
): OptimisticUpdateStorageStore<K> {
    const getValue =
        typeof storageConnectionOrGetValue === "function"
            ? storageConnectionOrGetValue
            : storageConnectionOrGetValue.get;

    const setValue =
        typeof storageConnectionOrGetValue === "function"
            ? setPersistedValue!
            : storageConnectionOrGetValue.set;

    const [value, setValueStore] = createStore<{ data?: K }>({});

    onMount(async () => {
        const savedValue = await getValue();
        setValueStore({data: savedValue});
        logger.debug({value: savedValue}, "SyncedStorageStore: loaded initial value");
    });

    const updateValue = async (newValue: K) => {
        logger.debug({newValue}, "SyncedStorageStore: updateValue");
        setValueStore({data: newValue});
        setValue(newValue);
    };

    return {
        get value() {
            return value.data;
        },
        updateValue,
    };
}