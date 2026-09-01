import {createStorageConnectionFactory} from "@lib/sharedStorage/storageConnection.ts";
import {storageDefinitions} from "@shared/storage/storageDefinitions.ts";

export const createStorageConnection = createStorageConnectionFactory(storageDefinitions);
