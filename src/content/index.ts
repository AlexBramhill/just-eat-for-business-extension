import {logger} from "../shared/logger";
import {features} from "./features/features.ts";

const processPage = () => {
    features.forEach(feature => {
        if (feature.shouldRun()) {
            feature.run();
        }
    });
};

const observer = new MutationObserver(() => {
    logger.debug("DOM mutated, processing page again");
    processPage();
});

observer.observe(document, {
    childList: true,
    subtree: true,
});

processPage();
