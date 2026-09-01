export type Logger = {
  debug: (obj: unknown, msg?: string) => void;
  error: (obj: unknown, msg?: string) => void;
};

export const noopLogger: Logger = {
  debug: () => {},
  error: () => {},
};
