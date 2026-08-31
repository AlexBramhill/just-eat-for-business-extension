import {logger} from "@shared/logger.ts";
import {type ZodType} from "zod";

export type StorageConnection<TStorageSchema, TStorageKey extends keyof TStorageSchema> = {
    set: (value: TStorageSchema[TStorageKey]) => Promise<void>;
    get: () => Promise<TStorageSchema[TStorageKey]>;
};

export const createStorageConnection = <TStorageSchema, TStorageKey extends keyof TStorageSchema>(
    key: TStorageKey,
    parser: ZodType<TStorageSchema[TStorageKey]>,
    defaultValue: TStorageSchema[TStorageKey]
): StorageConnection<TStorageSchema, TStorageKey> => {
    const set = async (value: TStorageSchema[TStorageKey]): Promise<void> => {
        logger.debug({key, value}, "storageConnection: set");
        await chrome.storage.local.set({[key]: JSON.parse(JSON.stringify(value))});
    };

    const get = async (): Promise<TStorageSchema[TStorageKey]> => {
        const result = await chrome.storage.local.get(key as string);

        const storedValue = result[key as string];

        if (storedValue !== undefined) {
            logger.debug({key, value: storedValue}, "storageConnection: get (stored)");
            return parser.parse(storedValue);
        }

        logger.debug({key, value: defaultValue}, "storageConnection: get (default)");
        return parser.parse(defaultValue);
    };

    return {
        set,
        get,
    };
};