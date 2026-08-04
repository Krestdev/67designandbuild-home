"use client";

import { useEffect } from "react";
import { loadStoredLocale } from "@/store/locale-store";

export function LocaleInitializer() {
  useEffect(() => {
    loadStoredLocale();
  }, []);

  return null;
}