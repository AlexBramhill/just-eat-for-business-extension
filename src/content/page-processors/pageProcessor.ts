import {logger} from "../../shared/logger";
import {addProcessJustEatPageEventListener} from "./justEatPageProcessor.ts";
import {isOnJustEatPage} from "./justEatPageDeterminator.ts";

export const processPage = async () => {
    if (!(await isOnJustEatPage())) {
        logger.debug("Not on Jira page, skipping processors");
        return;
    }

    logger.debug("On Jira page, registering processors");
    addProcessJustEatPageEventListener();
};
