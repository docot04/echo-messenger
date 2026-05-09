import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { languages, type LanguageKey, type TranslationKeys } from "../locales";

type LanguageContextType = {
  lang: LanguageKey;
  setLang: (lang: LanguageKey) => void;
  t: (key: TranslationKeys) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LanguageKey>(() => {
    const stored = localStorage.getItem("language") as LanguageKey | null;
    return stored && stored in languages ? stored : "en";
  });

  useEffect(() => {
    localStorage.setItem("language", lang);
  }, [lang]);

  const t = (key: TranslationKeys): string => {
    const keys = key.split(".");
    let value: unknown = languages[lang];

    for (const k of keys) {
      if (typeof value !== "object" || value === null) {
        console.warn(`Invalid translation path: ${key}`);
        return key;
      }
      value = (value as Record<string, unknown>)[k];
    }

    if (typeof value !== "string") {
      console.warn(`Missing translation: ${key}`);
      return key;
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return ctx;
}
