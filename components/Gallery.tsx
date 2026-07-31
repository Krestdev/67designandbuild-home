"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { catalogQuery } from "@/hooks/catalog/catalogQuery";
import { catalogListQuery } from "@/hooks/catalog/catalogListQuery";
import type { CatalogPageGlobal, Catalog } from "@/hooks/catalog/type";
import { Container } from "@/components/Container";
import { useLocale } from "@/providers/localeProvider";

export function Gallery() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { locale, t } = useLocale();

  const {
    data: intro,
    isLoading: introLoading,
    error: introError,
  } = useQuery<CatalogPageGlobal>({
    queryKey: ["catalog-intro", locale],
    queryFn: () => catalogQuery.getBlobal({ locale }),
  });

  const {
    data: items,
    isLoading: listLoading,
    error: listError,
  } = useQuery<Catalog[]>({
    queryKey: ["catalogs", locale],
    queryFn: () => catalogListQuery.get({ depth: 2, locale }),
  });

  if (introLoading || listLoading) return null;

  if (introError || listError) {
    console.error("Gallery section failed to load:", introError ?? listError);
    return null;
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <h2 className="font-semibold text-2xl md:text-5xl leading-[1.1] tracking-[-0.025em] text-[#212121] mb-4 max-w-[640px] mx-auto text-center">
          {intro?.title}
        </h2>

        <p className="text-base leading-[1.5] text-[#333333] md:text-[#5B5B5B] mb-10 max-w-[640px] mx-auto text-center">
          {intro?.intro}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
                className="relative aspect-[4/3] overflow-hidden group"
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
                    <span className="inline-block bg-[#FBF3EA] text-[#212121] text-xs leading-[1.5] uppercase px-2 py-1  self-start mb-1">
                      {categoryTitle}
                    </span>
                  )}

                  <p className="text-white font-semibold text-xl leading-none">
                    {item.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/realisations"
            className="inline-block mt-8 text-sm underline"
          >
            {t("seeAll")}
          </Link>
        </div>
      </Container>
    </section>
  );
}