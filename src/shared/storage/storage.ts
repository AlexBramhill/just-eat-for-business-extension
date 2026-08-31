import {createStorageConnectionFactory} from "@lib/sharedStorage/storageConnection.ts";
import {type StorageSchemas} from "@shared/storage/storageSchemas.ts";

export const {createStorageConnection} = createStorageConnectionFactory<StorageSchemas>();
