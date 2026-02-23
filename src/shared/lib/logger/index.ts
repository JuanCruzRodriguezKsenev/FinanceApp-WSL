import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  // Ofuscación de PII (Personally Identifiable Information)
  redact: {
    paths: ["cbu", "cvu", "email", "password", "token", "alias", "description"],
    censor: (value: any, path: string[]) => {
      if (typeof value === "string") {
        if (path[0] === "cbu" || path[0] === "cvu") {
          return `***${value.slice(-4)}`;
        }
        return "[REDACTED]";
      }
      return value;
    },
  },
  // Formato bonito en desarrollo
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
});
