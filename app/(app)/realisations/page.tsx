"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { realisationsGlobalQuery } from "@/hooks/realisation/realisationsGlobalQuery";
import { catalogListQuery } from "@/hooks/catalog/catalogListQuery";
import { sectorListQuery } from "@/hooks/sector/sectorListQuery";
import type { RealisationsGlobal } from "@/hooks/realisation/type";
import type { Catalog } from "@/hooks/catalog/type";
import type { Sector } from "@/hooks/sector/type";
import { CtaBanner } from "@/components/CtaBanner";
import { useLocale } from "@/providers/localeProvider";

function RealisationsContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6">{children}</div>;
}

export default function RealisationsPage() {
  const [activeFilter, setActiveFilter] = useState<number | "all">("all");
  const { locale } = useLocale();

  const { data: intro, isLoading: introLoading, error: introError } = useQuery<RealisationsGlobal>({
    queryKey: ["realisations-global", locale],
    queryFn: () => realisationsGlobalQuery.getBlobal({ locale }),
  });

  const { data: catalogItems, isLoading: catalogLoading, error: catalogError } = useQuery<Catalog[]>({
    queryKey: ["catalogs-realisations", locale],
    queryFn: () => catalogListQuery.get({ depth: 2, locale }),
  });

  const { data: sectors, isLoading: sectorsLoading, error: sectorsError } = useQuery<Sector[]>({
    queryKey: ["sectors-realisations", locale],
    queryFn: () => sectorListQuery.get({ locale }),
  });

  if (introLoading || catalogLoading || sectorsLoading) return null;
  if (introError || catalogError || sectorsError || !intro) return null;

  const items = catalogItems ?? [];
  const allSectors = sectors ?? [];

  // Only show a chip for a Sector that actually has ≥1 catalog item —
  // avoids a filter that always returns an empty grid.
  const usedSectorIds = new Set(
    items
      .map((item) =>
        typeof item.category === "object" ? item.category?.id : item.category
      )
      .filter((id): id is number => id != null)
  );
  const availableSectors = allSectors.filter((s) => usedSectorIds.has(s.id));

  const filteredItems =
    activeFilter === "all"
      ? items
      : items.filter((item) => {
          const catId =
            typeof item.category === "object" ? item.category?.id : item.category;
          return catId === activeFilter;
        });

  const heroImage =
    intro.heroImage && typeof intro.heroImage === "object"
      ? intro.heroImage.url
      : null;

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="relative min-h-[280px] sm:min-h-[340px] md:min-h-[409.6px] flex items-center justify-center py-14 sm:py-0">
        {heroImage && (
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover -z-10"
          />
        )}
        <div className="absolute inset-0 bg-black/50 -z-10" />

        <RealisationsContainer>
          <div className="flex flex-col gap-2 sm:gap-3 items-center text-center max-w-[700px] mx-auto">
            <h1 className="font-semibold text-3xl sm:text-4xl md:text-[56px] leading-[1.15] md:leading-[1.1] tracking-[-0.02em] md:tracking-[-0.025em] text-white">
              {intro.heroTitle}
            </h1>
            <p className="text-sm sm:text-base leading-[1.5] text-[#D1D5DB]">
              {intro.heroSubtitle}
            </p>
          </div>
        </RealisationsContainer>
      </section>

      <section className="bg-[#FBF3EA] py-10 sm:py-16 md:py-[120px]">
        <RealisationsContainer>
          {/* ---- FILTER BAR ---- */}
          <div className="mb-6 sm:mb-8">
            <p className="text-base sm:text-[18px] font-semibold leading-[1.5] text-[#212121] mb-3">
              Filtrer par type
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3.5 py-2 sm:px-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === "all"
                    ? "bg-[#1C1C1C] text-white"
                    : "bg-[#FFF0DF] text-[#1A1A1A] border border-[#EDD3B7]"
                }`}
              >
                Tous
              </button>
              {availableSectors.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => setActiveFilter(sector.id)}
                  className={`px-3.5 py-2 sm:px-4 text-sm sm:text-[16px] font-normal whitespace-nowrap leading-[1.5] transition-colors ${
                    activeFilter === sector.id
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#FFF0DF] text-[#212121] border border-[#EDD3B7]"
                  }`}
                >
                  {sector.title}
                </button>
              ))}
            </div>
          </div>

          {/* ---- PROJECT GRID ---- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-2">
            {filteredItems.map((item) => {
              const imageUrl =
                item.preveiw && typeof item.preveiw === "object"
                  ? item.preveiw.url
                  : null;
              const categoryTitle =
                item.category && typeof item.category === "object"
                  ? item.category.title
                  : null;

              if (!imageUrl) return null;

              return (
                <Link
                  key={item.id}
                  href={`/realisations/${item.slug ?? ""}`}
                  className="relative aspect-[4/3] overflow-hidden group block"
                >
                  <Image
                    src={imageUrl}
                    alt={item.title ?? ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  {/* On touch devices there's no hover, so this stays subtly visible
                      via a lighter default gradient, and fully opaque on hover/focus */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3 sm:p-4 text-left opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    {categoryTitle && (
                      <span className="inline-block bg-[#FBF3EA] text-[#212121] text-xs leading-[1.5] uppercase px-2 py-1 self-start mb-1">
                        {categoryTitle}
                      </span>
                    )}
                    <p className="text-white font-semibold text-lg sm:text-xl leading-none">
                      {item.title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </RealisationsContainer>
      </section>

      <CtaBanner />
    </div>
  );
}