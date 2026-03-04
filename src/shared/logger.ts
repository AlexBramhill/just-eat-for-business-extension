import pino from "pino";
import { isDebug } from "./debugger";

const level = isDebug() ? "debug" : "info";

export const logger = pino({
  level,
  browser: {
    asObject: true,
  },
});
