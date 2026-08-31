import {logger} from "@shared/logger.ts";
import {onMount} from "solid-js";
import {createStore} from "solid-js/store";

export type OptimisticUpdateStorageStore<K extends object> = {
    value: K | undefined;
    updateValue: (newValue: K) => void;
};

export const createOptimisticUpdateStorageStore = <K extends object>(
    getValue: () => Promise<K>,
    setPersistedValue: (newValue: K) => void,
): OptimisticUpdateStorageStore<K> => {
    const [value, setValue] = createStore<{ data?: K }>({});

    onMount(async () => {
        const savedValue = await getValue();
        setValue({data: savedValue});
        logger.debug({value: savedValue}, "SyncedStorageStore: loaded initial value");
    });

    const updateValue = async (newValue: K) => {
        logger.debug({newValue}, "SyncedStorageStore: updateValue");
        setValue({data: newValue});
        setPersistedValue(newValue);
    };

    return {
        get value() {
            return value.data;
        },
        updateValue,
    }
}