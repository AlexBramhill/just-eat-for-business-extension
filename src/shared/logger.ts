import {isDebug} from "@shared/debugger.ts";
import pino from "pino";

const level = isDebug() ? "debug" : "info";

export const logger = pino({
    level,
    browser: {
        asObject: true,
    },
});
