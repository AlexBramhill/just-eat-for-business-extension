import newTabToggle from "./newTabToggle.ts";

export type Feature = {
    shouldRun: () => Promise<boolean>;
    run: () => Promise<void>;
}

export const features: Feature[] = [
    newTabToggle
];