type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

type NestedKeys<T> = {
  [K in keyof T]: T[K] extends object ? K | Join<K, NestedKeys<T[K]>> : K;
}[keyof T];

import en from "./en.json";

export const languages = {
  en,
};

export type LanguageKey = keyof typeof languages;
export type TranslationKeys = NestedKeys<typeof en>;
