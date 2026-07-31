"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, X } from "lucide-react";
import { sectorListQuery } from "@/hooks/sector/sectorListQuery";
import { serviceListQuery } from "@/hooks/service/serviceListQuery";
import { NavbarGlobal } from "@/hooks/nav/type";
import { useLocale, LOCALES } from "@/providers/localeProvider";

type AccordionKey = "services" | "sectors" | "langue" | null;

const rowClass =
  "flex min-h-[48px] w-full items-center justify-between gap-2 py-3 px-6 text-left text-sm font-medium text-white";

export function MobileMenu({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: NavbarGlobal;
}) {
  const { locale, setLocale } = useLocale();
  const [expanded, setExpanded] = useState<AccordionKey>(null);
  const [mounted, setMounted] = useState(false);

  // document.body doesn't exist during SSR — only portal once mounted client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: services } = useQuery({
    queryKey: ["services-nav", locale],
    queryFn: () => serviceListQuery.get({ locale }),
    enabled: open,
  });

  const { data: sectors } = useQuery({
    queryKey: ["sectors-nav", locale],
    queryFn: () => sectorListQuery.get({ locale }),
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  if (!open || !mounted) return null;

  const toggle = (key: AccordionKey) =>
    setExpanded((cur) => (cur === key ? null : key));

  const menu = (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#212121] md:hidden">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-base font-semibold uppercase tracking-wide text-white">
          Menu
        </span>
        <button aria-label="Close menu" onClick={onClose} className="text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto">
        <Link href="/" className={rowClass} onClick={onClose}>
          Accueil
        </Link>

        <Link href="/about" className={rowClass} onClick={onClose}>
          {data.aboutUs}
        </Link>

        <button
          className={rowClass}
          onClick={() => toggle("services")}
          aria-expanded={expanded === "services"}
        >
          {data.services}
          <ChevronDown
            className={`h-[6px] w-[11px] shrink-0 transition-transform ${
              expanded === "services" ? "rotate-180" : ""
            }`}
          />
        </button>
        {expanded === "services" && (
          <>
            <div className="border-t border-white/10" />
            {(services ?? []).map((service) =>
              service.slug ? (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className={`${rowClass} font-normal`}
                  onClick={onClose}
                >
                  {service.title}
                </Link>
              ) : null
            )}
          </>
        )}

        <button
          className={rowClass}
          onClick={() => toggle("sectors")}
          aria-expanded={expanded === "sectors"}
        >
          {data.sectors}
          <ChevronDown
            className={`h-[6px] w-[11px] shrink-0 transition-transform ${
              expanded === "sectors" ? "rotate-180" : ""
            }`}
          />
        </button>
        {expanded === "sectors" && (
          <>
            <div className="border-t border-white/10" />
            {(sectors ?? []).map((sector) =>
              sector.slug ? (
                <Link
                  key={sector.id}
                  href={`/sector/${sector.slug}`}
                  className={`${rowClass} font-normal`}
                  onClick={onClose}
                >
                  {sector.title}
                </Link>
              ) : null
            )}
          </>
        )}

        <Link href="/realisations" className={rowClass} onClick={onClose}>
          Réalisations
        </Link>
        <Link href="/blog" className={rowClass} onClick={onClose}>
          {data.blogs}
        </Link>
        <Link href="/career" className={rowClass} onClick={onClose}>
          {data.careers}
        </Link>
        <Link href="/contact" className={rowClass} onClick={onClose}>
          {data.contact}
        </Link>

        <button
          className={rowClass}
          onClick={() => toggle("langue")}
          aria-expanded={expanded === "langue"}
        >
          Langue
          <ChevronDown
            className={`h-[6px] w-[11px] shrink-0 transition-transform ${
              expanded === "langue" ? "rotate-180" : ""
            }`}
          />
        </button>
        {expanded === "langue" && (
          <>
            <div className="border-t border-white/10" />
            {LOCALES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLocale(l.code)}
                className={`${rowClass} font-normal ${
                  l.code === locale ? "text-white" : "text-white/60"
                }`}
              >
                {l.label}
              </button>
            ))}
          </>
        )}
      </nav>
    </div>
  );

  return createPortal(menu, document.body);
}