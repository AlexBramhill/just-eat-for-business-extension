import { type Logger, noopLogger } from '@lib/logger/logger.ts';
import type { StorageDefinition } from '@lib/sharedStorage/storageDefinition.ts';

export type StorageConnection<T> = {
  set: (value: T) => Promise<void>;
  get: () => Promise<T>;
};

type AnyStorageDefinitions = readonly StorageDefinition<string, object>[];

type DefinitionForKey<
  Defs extends AnyStorageDefinitions,
  K extends Defs[number]['key'],
> = Extract<Defs[number], { key: K }>;

type ValueForKey<
  Defs extends AnyStorageDefinitions,
  K extends Defs[number]['key'],
> = DefinitionForKey<Defs, K> extends StorageDefinition<K, infer T> ? T : never;

export const createStorageConnectionFactory = <
  Defs extends AnyStorageDefinitions,
>(
  storageDefinitions: Defs,
  logger: Logger = noopLogger,
) => {
  return <K extends Defs[number]['key']>(
    key: K,
  ): StorageConnection<ValueForKey<Defs, K>> => {
    const isDefinitionForKey = (
      def: Defs[number],
    ): def is StorageDefinition<K, ValueForKey<Defs, K>> => def.key === key;
    const storageDefinition = storageDefinitions.find(isDefinitionForKey);

    if (!storageDefinition) {
      throw new Error(`storage definition not found for key: ${key}`);
    }

    return createUntypedStorageConnection<ValueForKey<Defs, K>>(
      storageDefinition,
      logger,
    );
  };
};

const createUntypedStorageConnection = <T extends object>(
  storageDefinition: StorageDefinition<string, T>,
  logger: Logger,
): StorageConnection<T> => {
  const { key, schema, defaultValue, area = 'local' } = storageDefinition;
  const storageArea = chrome.storage[area];

  const set = async (value: T): Promise<void> => {
    logger.debug({ key, value }, 'storageConnection: set');
    await storageArea.set({ [key]: JSON.parse(JSON.stringify(value)) });
  };

  const get = async (): Promise<T> => {
    const result = await storageArea.get(key);
    const storedValue = result[key];

    if (storedValue !== undefined) {
      logger.debug(
        { key, value: storedValue },
        'storageConnection: get (chrome store)',
      );
      return schema.parse(storedValue);
    }

    logger.debug(
      { key, value: defaultValue },
      'storageConnection: get (default)',
    );
    return defaultValue;
  };

  return { set, get };
};
