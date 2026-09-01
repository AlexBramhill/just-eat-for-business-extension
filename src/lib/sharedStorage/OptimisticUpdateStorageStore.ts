import { type Logger, noopLogger } from '@lib/logger/logger.ts';
import type { StorageConnection } from '@lib/sharedStorage/storageConnection.ts';
import { createStore } from 'solid-js/store';

export type OptimisticUpdateStorageStore<K extends object> = {
  value: K | undefined;
  updateValue: (newValue: K) => Promise<void>;
};

export function createOptimisticUpdateStorageStore<K extends object>(
  { set: setValue, get: getValue }: StorageConnection<K>,
  logger: Logger = noopLogger,
): OptimisticUpdateStorageStore<K> {
  const [value, setValueStore] = createStore<{ data?: K }>({});

  (async () => {
    const savedValue = await getValue();
    setValueStore({ data: savedValue });
    logger.debug(
      { value: savedValue },
      'SyncedStorageStore: loaded initial value',
    );
  })();

  const updateValue = async (newValue: K) => {
    logger.debug({ newValue }, 'SyncedStorageStore: updateValue');
    const previousValue = value.data;

    setValueStore({ data: newValue });

    try {
      await setValue(newValue);
    } catch (error) {
      setValueStore({ data: previousValue });
      logger.error({ error, newValue }, 'Failed to persist value');
      throw error;
    }
  };

  return {
    get value() {
      return value.data;
    },
    updateValue,
  };
}
