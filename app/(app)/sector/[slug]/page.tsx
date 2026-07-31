"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { PlusCircle } from "lucide-react";
import { sectorListQuery } from "@/hooks/sector/sectorListQuery";
import type { Sector } from "@/hooks/sector/type";
import { CtaBanner } from "@/components/CtaBanner";
import { useLocale } from "@/providers/localeProvider";

function SectorContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-6">{children}</div>;
}

// Reused from Gallery.tsx's card visual/hover behavior — same pattern used
// on the Service detail page. TODO: extract into a shared <ProjectCard />.
function RelatedProjectCard({
  item,
}: {
  item: NonNullable<Sector["relatedProjects"]>[number];
}) {
  if (typeof item !== "object") return null;

  const imageUrl =
    item.preveiw && typeof item.preveiw === "object" ? item.preveiw.url : null;
  const categoryTitle =
    item.category && typeof item.category === "object"
      ? item.category.title
      : null;

  if (!imageUrl) return null;

  return (
    <div className="relative aspect-[4/3] overflow-hidden group">
      <Image
        src={imageUrl}
        alt={item.title ?? ""}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-left opacity-0 group-hover:opacity-100 transition-opacity">
        {categoryTitle && (
          <span className="inline-block bg-[#FBF3EA] text-[#212121] text-xs leading-[1.5] uppercase px-2 py-1 self-start mb-1">
            {categoryTitle}
          </span>
        )}
        <p className="text-white font-semibold text-xl leading-none">
          {item.title}
        </p>
      </div>
    </div>
  );
}

function AssociatedServicesList({
  services,
}: {
  services: Sector["associatedServices"];
}) {
  if (!services || services.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-[32px] leading-[1.1] text-[#212121]">
        Services associés
      </h2>
      <ul className="flex flex-col gap-2">
        {services.map((service, i) => {
          if (typeof service !== "object") return null;
          return (
            <li key={i} className="flex items-center gap-2">
              <PlusCircle
                className="w-5 h-5 shrink-0"
                fill="#D97B2C"
                stroke="white"
                strokeWidth={1.5}
              />
              <span className="text-xl leading-[1.5] text-[#212121] font-medium">
                {service.title}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function SectorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { locale } = useLocale();

  const {
    data: sectors,
    isLoading,
    error,
  } = useQuery<Sector[]>({
    queryKey: ["sector", slug, locale],
    queryFn: () =>
      sectorListQuery.get({
        "where[slug][equals]": slug,
        depth: 2,
        locale,
      }),
  });

  if (isLoading) return null;
  if (error || !sectors || sectors.length === 0) return null;

  const sector = sectors[0];
  const relatedProjects = sector.relatedProjects ?? [];
  const galleryPhotos = sector.gallery ?? [];
  const associatedServices = sector.associatedServices ?? [];

  const heroImage =
    sector.image && typeof sector.image === "object" ? sector.image.url : null;

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="relative min-h-[409.6px] flex items-center justify-center">
        {heroImage && (
          <Image
            src={heroImage}
            alt={sector.title ?? ""}
            fill
            priority
            className="object-cover -z-10"
          />
        )}
        <div className="absolute inset-0 bg-black/40 -z-10" />

        <SectorContainer>
          <div className="flex flex-col gap-2 items-center text-center">
            <p className="font-semibold text-base leading-[1.5] text-[#FFF0DF]">
              Secteur d&rsquo;Activité
            </p>
            <h1 className="font-semibold text-4xl md:text-[48px] leading-[1.1] tracking-[-0.025em] text-white">
              {sector.title}
            </h1>
          </div>
        </SectorContainer>
      </section>

      {/* ---- DESCRIPTION + SERVICES ASSOCIÉS ---- */}
      <section className="bg-[#FBF3EA] py-16 md:py-[120px]">
        <SectorContainer>
          <div className="max-w-[1024px] text-base leading-[1.5] text-[#212121] mb-12">
            {sector.content && <RichText data={sector.content} />}
          </div>

          {galleryPhotos.length === 3 ? (
            // Exact Figma layout: Services associés + 3 images in a 2x2
            // grid, each image with its own confirmed aspect ratio.
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AssociatedServicesList services={associatedServices} />

              {[
                { ratio: "aspect-[16/9]" },
                { ratio: "aspect-[4/3]" },
                { ratio: "aspect-square" },
              ].map((cfg, i) => {
                const item = galleryPhotos[i];
                const url =
                  item.photo && typeof item.photo === "object"
                    ? item.photo.url
                    : null;
                if (!url) return null;
                return (
                  <div
                    key={i}
                    className={`relative ${cfg.ratio} overflow-hidden`}
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            // Fallback for any other photo count — uniform wrapping grid.
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AssociatedServicesList services={associatedServices} />

              {galleryPhotos.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {galleryPhotos.map((item, i) => {
                    const url =
                      item.photo && typeof item.photo === "object"
                        ? item.photo.url
                        : null;
                    if (!url) return null;
                    return (
                      <div
                        key={i}
                        className="relative aspect-[4/3] overflow-hidden"
                      >
                        <Image
                          src={url}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </SectorContainer>
      </section>

      {/* ---- PROJETS ASSOCIÉS ---- */}
      {relatedProjects.length > 0 && (
        <section className="bg-[#FBF3EA] pb-16 md:pb-[120px]">
          <SectorContainer>
            <h2 className="font-semibold text-[28px] md:text-[48px] leading-[1.1] tracking-[-0.025em] text-[#212121] text-center max-w-[640px] mx-auto mb-12">
              Projets associés
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {relatedProjects.map((item, i) => (
                <RelatedProjectCard key={i} item={item} />
              ))}
            </div>
          </SectorContainer>
        </section>
      )}

      <CtaBanner />
    </div>
  );
}