import type {StorageDefinition} from "@lib/sharedStorage/storageDefinition.ts";
import {logger} from "@shared/logger.ts";

export type StorageConnection<T> = {
    set: (value: T) => Promise<void>;
    get: () => Promise<T>;
};

type AnyStorageDefinitions = readonly StorageDefinition<string, object>[];

type DefinitionForKey<Defs extends AnyStorageDefinitions, K extends AnyStorageDefinitions[number]['key']> = Extract<Defs[number], {
    key: K
}>;

type ValueForKey<Defs extends AnyStorageDefinitions, K extends Defs[number]["key"]> =
    DefinitionForKey<Defs, K> extends StorageDefinition<K, infer T> ? T : never;

export const createStorageConnectionFactory = <Defs extends AnyStorageDefinitions>(storageDefinitions: Defs) => {
    return <K extends Defs[number]["key"]>(key: K, defaultValue: ValueForKey<Defs, K>): StorageConnection<ValueForKey<Defs, K>> => {
        const isDefinitionForKey = (def: Defs[number]): def is StorageDefinition<K, ValueForKey<Defs, K>> =>
            def.key === key;
        const storageDefinition = storageDefinitions.find(isDefinitionForKey);

        if (!storageDefinition) {
            throw new Error("storage definition not found");
        }
        return createUntypedStorageConnection<ValueForKey<Defs, K>>(storageDefinition, defaultValue)
    }
}

const createUntypedStorageConnection = <T extends object>(
    storageDefinition: StorageDefinition<string, T>,
    defaultValue: T
): StorageConnection<T> => {
    const {key, schema} = storageDefinition;
    const set = async (value: T): Promise<void> => {
        logger.debug({key, value}, "storageConnection: set");
        await chrome.storage.local.set({[key]: JSON.parse(JSON.stringify(value))});
    };

    const get = async (): Promise<T> => {
        const result = await chrome.storage.local.get(key as string);

        const storedValue = result[key as string];

        if (storedValue !== undefined) {
            logger.debug({key, value: storedValue}, "storageConnection: get (chrome store)");
            return schema.parse(storedValue);
        }

        logger.debug({key, value: defaultValue}, "storageConnection: get (default)");
        return schema.parse(defaultValue);
    };

    return {
        set,
        get,
    };
};
