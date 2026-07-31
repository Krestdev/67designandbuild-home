"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { sectorQuery } from "@/hooks/sector/sectorQuery";
import { sectorListQuery } from "@/hooks/sector/sectorListQuery";
import type { SectorPageGlobal, Sector } from "@/hooks/sector/type";
import { useLocale } from "@/providers/localeProvider";

export function Sectors() {
  const { locale } = useLocale();

  const {
    data: intro,
    isLoading: introLoading,
    error: introError,
  } = useQuery<SectorPageGlobal>({
    queryKey: ["sector-intro", locale],
    queryFn: () => sectorQuery.getBlobal({ locale }),
  });

  const {
    data: sectors,
    isLoading: listLoading,
    error: listError,
  } = useQuery<Sector[]>({
    queryKey: ["sectors", locale],
    queryFn: () =>
      sectorListQuery.get({ depth: 1, locale, sort: "createdAt" }),
  });

  if (introLoading || listLoading) return null;

  if (introError || listError) {
    console.error("Sectors section failed to load:", introError ?? listError);
    return null;
  }

  if (!sectors || sectors.length === 0) return null;

  return (
    <section className="bg-[#212121] text-white py-16 md:py-[120px]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
        <div>
          <h2 className="font-semibold text-[28px] md:text-5xl leading-[1.1] tracking-[-0.025em] max-w-[640px] mb-2">
            {intro?.title}
          </h2>

          <p className="text-base leading-[1.5] text-[#AFAFAF] max-w-[640px]">
            {intro?.intro}
          </p>
        </div>

        <div className="flex gap-[38px] overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {sectors.map((sector) => {
            const imageUrl =
              sector.image && typeof sector.image === "object"
                ? sector.image.url
                : null;

            if (!imageUrl) return null;

            return (
              <div
                key={sector.id}
                className="shrink-0 w-[300px] snap-center bg-[#333333]"
              >
                <div className="relative h-[500px] w-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={sector.title ?? ""}
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-6 pr-4 pb-6 pl-4">
                  <h3 className="font-semibold text-xl leading-none">
                    {sector.title}
                  </h3>

                  {sector.description && (
                    <p className="text-sm leading-[1.5] text-[#AFAFAF]">
                      {sector.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}