import { type Logger, noopLogger } from '@lib/logger/logger.ts';
import { createStore } from 'solid-js/store';

export type OptimisticStore<K extends object> = {
  value: K | undefined;
  updateValue: (newValue: K) => Promise<void>;
};

export type PersistentStorageConnection<T> = {
  get: () => Promise<T>;
  set: (value: T) => Promise<void>;
};

export function createOptimisticStore<K extends object>(
  { set: setValue, get: getValue }: PersistentStorageConnection<K>,
  logger: Logger = noopLogger,
): OptimisticStore<K> {
  const [value, setValueStore] = createStore<{ data?: K }>({});

  (async () => {
    const savedValue = await getValue();
    setValueStore({ data: savedValue });
    logger.debug(
      { value: savedValue },
      'OptimisticStore: loaded initial value',
    );
  })();

  const updateValue = async (newValue: K) => {
    logger.debug({ newValue }, 'OptimisticStore: updateValue');
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
