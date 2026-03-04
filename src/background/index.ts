import { isDebug } from "../shared/debugger";
import { logger } from "../shared/logger";

if (isDebug()) {
  chrome.runtime.onInstalled.addListener(() => {
    logger.debug("Extension installed");
  });

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    logger.debug("Message received:", request);
    if (request.msg) {
      logger.debug("Message content:", request.msg);
    }
    sendResponse();
    return true;
  });
}
