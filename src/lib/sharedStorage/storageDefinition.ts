import type { ZodType } from 'zod';

export type StorageAreaName = 'local' | 'sync';

export type StorageDefinition<K extends string, T extends object> = {
  key: K;
  schema: ZodType<T>;
  defaultValue: T;
  area?: StorageAreaName;
};

type ValidStorageDefinition<D> = D extends {
  key: infer K extends string;
  schema: ZodType<infer T extends object>;
}
  ? StorageDefinition<K, T>
  : never;

export const createStorageDefinitions = <
  T extends readonly StorageDefinition<string, object>[],
>(
  storageDefinitions: T & readonly ValidStorageDefinition<T[number]>[],
) => {
  return storageDefinitions;
};
