import { isDebug } from '@shared/debugger.ts';
import { logger } from '@shared/logger.ts';

if (isDebug()) {
  chrome.runtime.onInstalled.addListener(() => {
    logger.debug('Extension installed');
  });

  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    logger.debug('Message received:', request);
    if (request.msg) {
      logger.debug('Message content:', request.msg);
    }
    sendResponse();
    return true;
  });
}
