import openInNewTab from "@content/features/openInNewTab.ts";

export type Feature = {
    shouldRun: () => Promise<boolean>;
    run: () => Promise<void>;
}

export const features: Feature[] = [
    openInNewTab
];