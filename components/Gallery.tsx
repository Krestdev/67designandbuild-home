"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { catalogQuery } from "@/hooks/catalog/catalogQuery";
import { catalogListQuery } from "@/hooks/catalog/catalogListQuery";
import type { CatalogPageGlobal, Catalog } from "@/hooks/catalog/type";

const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

export function Gallery() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const {
    data: intro,
    isLoading: introLoading,
    error: introError,
  } = useQuery<CatalogPageGlobal>({
    queryKey: ["catalog-intro", LOCALE],
    queryFn: () => catalogQuery.getBlobal({ locale: LOCALE }),
  });

  const {
    data: items,
    isLoading: listLoading,
    error: listError,
  } = useQuery<Catalog[]>({
    queryKey: ["catalogs", LOCALE],
    queryFn: () => catalogListQuery.get({ depth: 2, locale: LOCALE }),
  });

  if (introLoading || listLoading) return null;

  if (introError || listError) {
    console.error("Gallery section failed to load:", introError ?? listError);
    return null;
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="text-center px-6 md:px-8 py-16 md:py-24">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{intro?.title}</h2>
      <p className="text-sm text-[#1c1c1c]/70 mb-10 max-w-md mx-auto">
        {intro?.intro}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 max-w-5xl mx-auto">
        {items.map((item) => {
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
            <div
              key={item.id}
              className="relative h-56 md:h-64 overflow-hidden group"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Image
                src={imageUrl}
                alt={item.title ?? ""}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-left transition-opacity ${
                  hoveredId === item.id ? "opacity-100" : "opacity-0"
                }`}
              >
                {categoryTitle && (
                  <span className="inline-block bg-white/90 text-[#1c1c1c] text-xs uppercase px-2 py-1 rounded self-start mb-1">
                    {categoryTitle}
                  </span>
                )}
                <p className="text-white font-medium">{item.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Link href="/realisations" className="inline-block mt-8 text-sm underline">
        Tout voir
      </Link>
    </section>
  );
}