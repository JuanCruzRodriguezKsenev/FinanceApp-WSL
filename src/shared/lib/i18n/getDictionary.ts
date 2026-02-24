import type { Locale } from "./i18n-config";
import type { Dictionary } from "./types";

const dictionaries = {
  en: () => import("../../dictionaries/en.json").then((module) => module.default as Dictionary),
  es: () => import("../../dictionaries/es.json").then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]?.() ?? dictionaries.es();
