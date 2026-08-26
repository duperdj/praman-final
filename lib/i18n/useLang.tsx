"use client";

// Language context — Hindi is the default. Provides the current lang, the
// resolved dictionary, and a toggle. Persists the choice to localStorage so a
// reload keeps it, and stamps <html lang> for accessibility.
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "@/lib/contracts";
import { getDict, type Dict } from "./dict";

const STORAGE_KEY = "praman.lang";

interface LangContextValue {
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({
  children,
  initialLang = "hi",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // Rehydrate the persisted choice after mount (SSR renders Hindi first).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "hi" || saved === "en") setLangState(saved);
    } catch {
      /* localStorage may be unavailable; Hindi default stands. */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const value = useMemo<LangContextValue>(() => {
    const setLang = (next: Lang) => setLangState(next);
    return {
      lang,
      t: getDict(lang),
      setLang,
      toggle: () => setLangState((p) => (p === "hi" ? "en" : "hi")),
    };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within a <LangProvider>");
  return ctx;
}
