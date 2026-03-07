import {type StorageSchemas} from "./storageSchemas.ts";
import {logger} from "../logger.ts";

export type StorageConnection<K extends keyof StorageSchemas> = {
    set: (value: StorageSchemas[K]) => Promise<void>;
    get: () => Promise<StorageSchemas[K]>;
};

export const createStorageConnection = <K extends keyof StorageSchemas>(
    key: K,
    defaultValue: StorageSchemas[K]
): StorageConnection<K> => {
    const set = async (value: StorageSchemas[K]): Promise<void> => {
        logger.debug({ key, value }, "storageConnection: set");
        await chrome.storage.local.set({[key]: value});
    };

    const get = async (): Promise<StorageSchemas[K]> => {
        const result = await chrome.storage.local.get(key as string);

        const storedValue = result[key as string];

        if (storedValue !== undefined) {
            logger.debug({ key, value: storedValue }, "storageConnection: get (stored)");
            return storedValue as StorageSchemas[K];
        }

        logger.debug({ key, value: defaultValue }, "storageConnection: get (default)");
        return defaultValue;
    };

    return {
        set,
        get,
    };
};