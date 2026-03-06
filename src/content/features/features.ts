import newTabToggle from "./newTabToggle.ts";

export type Feature = {
    shouldRun: () => boolean;
    run: () => Promise<void>;
}

export const features: Feature[] = [
    newTabToggle
];