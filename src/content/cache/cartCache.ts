import {cacheStore} from "@content/cache/cartCacheStore.ts";
import {
    getCartInformation,
    type JustEatCartInformationResponse,
    type JustEatCartItem
} from "@content/clients/justEatClient.ts";
import {getSod, getSodToday} from "@content/dateHelpers.ts";
import {logger} from "@shared/logger.ts";
import {type CartCacheStorage} from "@shared/storage/storageSchemas.ts";

let pendingUpdate: Promise<CartCacheStorage | undefined> | null = null;

const get = async (): Promise<CartCacheStorage> => {
    const currentValue = await cacheStore.get();

    if (!isCacheStale(currentValue)) {
        logger.debug({cache: currentValue}, "cartCache: cache not stale: cache hit");
        return currentValue;
    }

    logger.debug({cachedDate: currentValue.date}, "cartCache: cache stale, fetching fresh data");
    if (!pendingUpdate) {
        pendingUpdate = updateCache().finally(() => {
            pendingUpdate = null;
        });
    }
    const newValue = await pendingUpdate;
    logger.debug({cache: newValue}, "cartCache: cache refreshed: cache hit");
    return newValue ?? currentValue; // Todo: update handling of undefined better
}

const isCacheStale = (cacheState: CartCacheStorage): boolean => {
    return getSod(cacheState.date).getTime() !== getSodToday().getTime()
};

const updateCache = async () => {
    const response: JustEatCartInformationResponse = await getCartInformation();
    if (!response) {
        logger.warn("cartCache: failed to fetch cart information, cache not updated");
        return;
    }

    const items = response.items.flatMap((item: JustEatCartItem) =>
        item.eaterOptions.map((option) => ({
            orderId: option.orderId,
            humanOrderId: option.orderHumanId
        }))
    )

    const newCacheState = {
        date: getSodToday(),
        items
    }
    await cacheStore.set(newCacheState)
    logger.debug({newCacheState}, "cartCache: cache updated");

    return newCacheState;
}

export const cartCache = {
    get,
}
