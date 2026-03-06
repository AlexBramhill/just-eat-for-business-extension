import {logger} from "../../shared/logger";
import {features} from "../features/features.ts";

export const addProcessJustEatPageEventListener = () => {
    const observer = new MutationObserver(() => {
        logger.debug("DOM mutated, processing page again");
        processPage();
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
    });
};

const processPage = () => {
    features.forEach(feature => {
        if (feature.shouldRun()) {
            feature.run()
        }
    })
};
