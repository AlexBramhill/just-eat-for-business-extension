import {createStorageConnection, type StorageConnection} from "../../shared/repositories/storageConnection.ts";
import {
    type CartCacheStorage,
    type CartCacheStorageItem,
    STORAGE_KEYS
} from "../../shared/repositories/storageSchemas.ts";
import {getSodToday} from "../dateHelpers.ts";
import {getCartInformation} from "../clients/justEatClient.ts";
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
    const cacheStore = createStorageConnection(STORAGE_KEYS.CART_CACHE, cartCacheDefault)
    const currentValue = await cacheStore.get();

    if (!isCacheStale(currentValue)) {
        logger.debug({ date: currentValue.date, itemCount: currentValue.items.length }, "cartCache: cache hit");
        return currentValue;
    }

    logger.debug({ cachedDate: currentValue.date }, "cartCache: cache stale, fetching fresh data");
    const newValue = await updateCache(cacheStore);
    return newValue ?? currentValue; // Todo: update handling of undefined better
}

const isCacheStale = (cacheState: CartCacheStorage): boolean =>
    cacheState.date.getTime() === getSodToday().getTime();

const updateCache = async (cacheStore: StorageConnection<typeof STORAGE_KEYS.CART_CACHE>) => {
    const response = await getCartInformation();
    if (!response) return;

    const items = response.items.map((item): CartCacheStorageItem => ({
        orderId: item.eaterOptions.orderId,
        humanOrderId: item.eaterOptions.orderHumanId,
    }))

    const newCacheState = {
        date: getSodToday(),
        items
    }
    await cacheStore.set(newCacheState)
    logger.debug({ itemCount: items.length }, "cartCache: cache updated");

    return newCacheState;
}

export const cartCache = {
    get: get,
}
