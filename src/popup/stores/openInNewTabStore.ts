import { createOptimisticStore } from '@lib/optimisticStore/optimisticStore.ts';
import { logger } from '@shared/logger.ts';
import { createStorageConnection } from '@shared/storage/storage.ts';
import { STORAGE_KEYS } from '@shared/storage/storageDefinitions.ts';

const openInNewTabStorageConnection = createStorageConnection(
  STORAGE_KEYS.OPEN_IN_NEW_TAB,
);

export const openInNewTabStore = createOptimisticStore(
  openInNewTabStorageConnection,
  logger,
);
