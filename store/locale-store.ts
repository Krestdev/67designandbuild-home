"use client";

import { create } from "zustand";
import { messages, type MessageKey } from "../providers/messages";

export type Locale = "fr" | "en" | "it";

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "it", label: "IT" },
];

const STORAGE_KEY = "locale";

function isLocale(value: string | null): value is Locale {
  return value === "fr" || value === "en" || value === "it";
}

type LocaleStore = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
};

export const useLocaleStore = create<LocaleStore>((set, get) => ({
  locale: DEFAULT_LOCALE,
  setLocale: (locale) => {
    set({ locale });
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  },
  t: (key) => messages[get().locale][key],
}));

// Called once on mount from a client component to restore any saved locale
export function loadStoredLocale() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) {
    useLocaleStore.getState().setLocale(stored);
  }
}