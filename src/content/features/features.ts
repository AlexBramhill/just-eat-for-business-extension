import openInNewTab from "./openInNewTab.ts";

export type Feature = {
    shouldRun: () => Promise<boolean>;
    run: () => Promise<void>;
}

export const features: Feature[] = [
    openInNewTab
];