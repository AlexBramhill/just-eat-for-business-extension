export const Environment = {
  Development: "development",
  Production: "production",
} as const;

export const isDevelopment = import.meta.env.MODE === Environment.Development;

export const isProduction = import.meta.env.MODE === Environment.Production;
