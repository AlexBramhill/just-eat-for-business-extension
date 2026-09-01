import { logger } from '@shared/logger.ts';
import { z } from 'zod';

export const createCachedSchema = <T extends z.ZodType>(valueSchema: T) =>
  z.object({
    date: z.coerce.date(),
    value: valueSchema,
  });

export type Cached<T> = {
  date: Date;
  value: T;
};

export const createCache = <T>({
  getStore,
  setStore,
  isStale,
  getUpdatedValue,
}: {
  getStore: () => Promise<Cached<T>>;
  setStore: (value: Cached<T>) => Promise<void>;
  getUpdatedValue: () => Promise<T>;
  isStale: (value: Cached<T>) => boolean;
}): { get: () => Promise<Cached<T>> } => {
  let pendingUpdate: Promise<Cached<T>> | null = null;

  const get = async () => {
    const updateCache = getUpdateCache({ setStore, getUpdatedValue });
    const currentValue = await getStore();

    if (!isStale(currentValue)) {
      logger.debug(
        { cache: currentValue },
        'Cache: cache not stale: cache hit',
      );
      return currentValue;
    }

    logger.debug(
      { cachedDate: currentValue.date },
      'Cache: cache stale, fetching fresh data',
    );

    if (!pendingUpdate) {
      pendingUpdate = updateCache().finally(() => {
        pendingUpdate = null;
      });
    }

    const newValue = await pendingUpdate;
    logger.debug({ cache: newValue }, 'Cache: cache refreshed: cache hit');
    return newValue;
  };

  return { get };
};

const getUpdateCache = <T>({
  setStore,
  getUpdatedValue,
}: {
  setStore: (value: Cached<T>) => Promise<void>;
  getUpdatedValue: () => Promise<T>;
}) => {
  const updateCache = async () => {
    const newCacheValue = await getUpdatedValue();

    const newCacheState = {
      date: new Date(),
      value: newCacheValue,
    };
    await setStore(newCacheState);

    logger.debug({ newCacheState }, 'cartCache: cache updated');

    return newCacheState;
  };

  return updateCache;
};
