import {createStorageConnection, type StorageConnection} from "../../shared/repositories/storageConnection.ts";
import {
    type CartCacheStorage,
    type CartCacheStorageItem,
    STORAGE_KEYS
} from "../../shared/repositories/storageSchemas.ts";
import {getSodToday} from "../dateHelpers.ts";
import {getCartInformation} from "../clients/justEatClient.ts";

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
        return currentValue;
    }

    const newValue = await updateCache(cacheStore);
    return newValue ?? currentValue; // Todo: update handling of undefined better
}

const isCacheStale = (cacheState: CartCacheStorage): boolean =>
    cacheState.date.getTime() === getSodToday().getTime();

const updateCache = async (cacheStore: StorageConnection<typeof STORAGE_KEYS.CART_CACHE>) => {
    const response = await getCartInformation();
    if (!response) return;

    // Todo: Zod
    const items = response.items.map((item): CartCacheStorageItem => ({
        orderId: item.eaterOptions.orderId,
        humanOrderId: item.eaterOptions.orderHumanId,
    }))

    const newCacheState = {
        date: getSodToday(),
        items
    }
    await cacheStore.set(newCacheState)

    return newCacheState;
}

export const cartCache = {
    get: get,
}
