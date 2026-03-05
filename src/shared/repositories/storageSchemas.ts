export const STORAGE_KEYS = {
    NEW_TAB_TOGGLE: "newTabToggle",
} as const;

export type NewTabToggleStorage = {
    isEnabled: boolean;
};

export type StorageSchemas = {
    [STORAGE_KEYS.NEW_TAB_TOGGLE]: NewTabToggleStorage
}