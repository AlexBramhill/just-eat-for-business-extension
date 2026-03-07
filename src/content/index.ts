import {logger} from "../shared/logger";
import {features} from "./features/features.ts";

const processPage = async () => {
    for (const feature of features) {
        if (await feature.shouldRun()) {
            await feature.run();
        }
    }
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
