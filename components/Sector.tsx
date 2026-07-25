"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { sectorQuery } from "@/hooks/sector/sectorQuery";
import { sectorListQuery } from "@/hooks/sector/sectorListQuery";
import type { SectorPageGlobal, Sector } from "@/hooks/sector/type";

const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

export function Sectors() {
  const {
    data: intro,
    isLoading: introLoading,
    error: introError,
  } = useQuery<SectorPageGlobal>({
    queryKey: ["sector-intro", LOCALE],
    queryFn: () => sectorQuery.getBlobal({ locale: LOCALE }),
  });

  const {
    data: sectors,
    isLoading: listLoading,
    error: listError,
  } = useQuery<Sector[]>({
    queryKey: ["sectors", LOCALE],
    queryFn: () => sectorListQuery.get({ depth: 1, locale: LOCALE }),
  });

  if (introLoading || listLoading) return null;

  if (introError || listError) {
    console.error("Sectors section failed to load:", introError ?? listError);
    return null;
  }

  if (!sectors || sectors.length === 0) return null;

  return (
    <section className="bg-[#1c1c1c] text-white px-6 md:px-8 py-16 md:py-24">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{intro?.title}</h2>
      <p className="text-sm text-white/60 mb-10 max-w-md">{intro?.intro}</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {sectors.map((sector) => {
          const imageUrl =
            sector.image && typeof sector.image === "object"
              ? sector.image.url
              : null;
          if (!imageUrl) return null;

          return (
            <div key={sector.id}>
              <div className="relative h-56 md:h-64  overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={sector.title ?? ""}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium mt-3 text-sm">{sector.title}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}