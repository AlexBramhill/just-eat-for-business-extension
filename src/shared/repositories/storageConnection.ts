import {type StorageSchemas} from "./storageSchemas.ts";

export type StorageConnection<K extends keyof StorageSchemas> = {
    set: (value: StorageSchemas[K]) => Promise<void>;
    get: () => Promise<StorageSchemas[K]>;
};

export const createStorageConnection = <K extends keyof StorageSchemas>(
    key: K,
    defaultValue: StorageSchemas[K]
): StorageConnection<K> => {
    const set = async (value: StorageSchemas[K]): Promise<void> => {
        await chrome.storage.local.set({[key]: value});
    };

    const get = async (): Promise<StorageSchemas[K]> => {
        const result = await chrome.storage.local.get(key as string);

        const storedValue = result[key as string];

        if (storedValue !== undefined) {
            return storedValue as StorageSchemas[K];
        }

        return defaultValue;
    };

    return {
        set,
        get,
    };
};