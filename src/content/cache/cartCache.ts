import { cacheStore } from '@content/cache/cartCacheStore.ts';
import {
  getCartInformation,
  type JustEatCartInformationResponse,
  type JustEatCartItem,
} from '@content/clients/justEatClient.ts';
import { getSod, getSodToday } from '@content/dateHelpers.ts';
import { createCache } from '@lib/cache/cache.ts';
import { logger } from '@shared/logger.ts';
import { type CartCacheStorageItem } from '@shared/storage/storageDefinitions.ts';

export const cartCache = createCache<CartCacheStorageItem[]>({
  getStore: cacheStore.get,
  setStore: cacheStore.set,
  isStale: (cachedValue) =>
    getSod(cachedValue.date).getTime() !== getSodToday().getTime(),
  logger,
  getUpdatedValue: async () => {
    const response: JustEatCartInformationResponse = await getCartInformation();

    return response.items.flatMap((item: JustEatCartItem) =>
      item.eaterOptions.map((option) => ({
        orderId: option.orderId,
        humanOrderId: option.orderHumanId,
      })),
    );
  },
});
