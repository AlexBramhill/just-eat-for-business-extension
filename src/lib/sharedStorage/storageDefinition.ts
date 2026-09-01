import type { ZodType } from 'zod';

export type StorageDefinition<K extends string, T extends object> = {
  key: K;
  schema: ZodType<T>;
};

export const createStorageDefinitions = <
  const T extends readonly StorageDefinition<string, object>[],
>(
  storageDefinitions: T,
) => {
  return storageDefinitions;
};
