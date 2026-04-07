import {createStorageConnection, type StorageConnection} from "../../shared/repositories/storageConnection.ts";
import {type CartCacheStorage, CartCacheStorageSchema, STORAGE_KEYS} from "../../shared/repositories/storageSchemas.ts";
import {getSodToday} from "../dateHelpers.ts";
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

const get = async () => {
    // TODO: Extract into store
    const cacheStore = createStorageConnection(STORAGE_KEYS.CART_CACHE, CartCacheStorageSchema, cartCacheDefault)
    const currentValue = await cacheStore.get();

    if (!isCacheStale(currentValue)) {
        logger.debug({cache: currentValue}, "cartCache: cache hit");
        return currentValue;
    }

    logger.debug({cachedDate: currentValue.date}, "cartCache: cache stale, fetching fresh data");
    const newValue = await updateCache(cacheStore);
    logger.debug({cache: newValue}, "cartCache: cache hit");
    return newValue ?? currentValue; // Todo: update handling of undefined better
}

const isCacheStale = (cacheState: CartCacheStorage): boolean => {
    console.debug({time: cacheState.date, isDate: cacheState.date instanceof Date}, "***");
    console.debug({time: getSodToday()}, "***")
    return cacheState.date.getTime() === getSodToday().getTime()
};

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

    const newCacheState: CartCacheStorage = {
        date: getSodToday(),
        items
    }
    await cacheStore.set(newCacheState)
    logger.debug({itemCount: items.length}, "cartCache: cache updated");

    return newCacheState;
}

export const cartCache = {
    get,
}
