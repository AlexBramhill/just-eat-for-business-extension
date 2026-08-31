import {logger} from "@shared/logger.ts";
import {type ZodType} from "zod";

export type StorageConnection<T> = {
    set: (value: T) => Promise<void>;
    get: () => Promise<T>;
};

const createUntypedStorageConnection = <T>(
    key: string,
    parser: ZodType<T>,
    defaultValue: T
): StorageConnection<T> => {
    const set = async (value: T): Promise<void> => {
        logger.debug({key, value}, "storageConnection: set");
        await chrome.storage.local.set({[key]: JSON.parse(JSON.stringify(value))});
    };

    const get = async (): Promise<T> => {
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

export const createStorageConnectionFactory = <TStorageSchema extends Record<string, object>>() => {
    const createStorageConnection = <K extends keyof TStorageSchema & string>(
        key: K,
        parser: ZodType<TStorageSchema[K]>,
        defaultValue: TStorageSchema[K]
    ): StorageConnection<TStorageSchema[K]> =>
        createUntypedStorageConnection(key, parser, defaultValue);

    return {createStorageConnection};
};
