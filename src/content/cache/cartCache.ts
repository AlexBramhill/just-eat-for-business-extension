import {createStorageConnection, type StorageConnection} from "../../shared/repositories/storageConnection.ts";
import {type CartCacheStorage, CartCacheStorageSchema, STORAGE_KEYS} from "../../shared/repositories/storageSchemas.ts";
import {getSod, getSodToday} from "../dateHelpers.ts";
import {
    getCartInformation,
    type JustEatCartInformationResponse,
    type JustEatCartItem
} from "../clients/justEatClient.ts";
import {logger} from "../../shared/logger.ts";

// Todo: Allow nullable default values
const cartCacheDefault: CartCacheStorage = {
    date: new Date(0),
    items: [
        {
            orderId: "0",
            humanOrderId: 0,
        }
    ]
}

const get = async (): Promise<CartCacheStorage> => {
    // TODO: Extract into store
    const cacheStore = createStorageConnection(STORAGE_KEYS.CART_CACHE, CartCacheStorageSchema, cartCacheDefault)
    const currentValue = await cacheStore.get();

    if (!isCacheStale(currentValue)) {
        logger.debug({cache: currentValue}, "cartCache: cache not stale: cache hit");
        return currentValue;
    }

    logger.debug({cachedDate: currentValue.date}, "cartCache: cache stale, fetching fresh data");
    const newValue = await updateCache(cacheStore);
    logger.debug({cache: newValue}, "cartCache: cache refreshed: cache hit");
    return newValue ?? currentValue; // Todo: update handling of undefined better
}

const isCacheStale = (cacheState: CartCacheStorage): boolean => {
    return getSod(cacheState.date).getTime() !== getSodToday().getTime()
};

// Need a debounce here
const updateCache = async (cacheStore: StorageConnection<typeof STORAGE_KEYS.CART_CACHE>) => {
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
