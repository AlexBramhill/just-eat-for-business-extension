import {logger} from "../shared/logger";
import {features} from "./features/features.ts";

const processPage = async () => {
    for (const feature of features) {
        if (await feature.shouldRun()) {
            await feature.run();
        }
    }
};

const observer = new MutationObserver(async () => {
    logger.debug("DOM mutated, processing page again");
    await processPage();
});

observer.observe(document, {
    childList: true,
    subtree: true,
});

processPage()