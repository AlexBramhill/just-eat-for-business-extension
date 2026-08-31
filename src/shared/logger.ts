import pino from "pino";
import {isDebug} from "@shared/debugger.ts";

const level = isDebug() ? "debug" : "info";

export const logger = pino({
    level,
    browser: {
        asObject: true,
    },
});
