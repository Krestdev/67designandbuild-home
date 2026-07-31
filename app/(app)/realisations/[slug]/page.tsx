"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { catalogListQuery } from "@/hooks/catalog/catalogListQuery";
import type { Catalog } from "@/hooks/catalog/type";
import { CtaBanner } from "@/components/CtaBanner";
import { useLocale } from "@/providers/localeProvider";

function RealisationContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-6">{children}</div>;
}

const STATUS_LABELS: Record<string, string> = {
  livre: "Livré",
  "en-cours": "En cours",
  planifie: "Planifié",
};

// Figma node 121:39/40-52 — label:value sits on one row, label auto-width,
// 8px gap, 8px vertical padding per row (37px row height)
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 py-2">
      <p className="text-sm text-[#6B7280] shrink-0">{label}</p>
      <p className="text-base font-medium text-[#212121]">{value}</p>
    </div>
  );
}

export default function RealisationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { locale } = useLocale();

  const {
    data: matches,
    isLoading,
    error,
  } = useQuery<Catalog[]>({
    queryKey: ["realisation", slug, locale],
    queryFn: () =>
      catalogListQuery.get({
        "where[slug][equals]": slug,
        depth: 2,
        locale,
      }),
  });

  const item = matches?.[0];
  const categoryId =
    item?.category && typeof item.category === "object"
      ? item.category.id
      : item?.category;

  const {
    data: relatedMatches,
    isLoading: relatedLoading,
  } = useQuery<Catalog[]>({
    queryKey: ["realisations-related", categoryId, locale],
    queryFn: () =>
      catalogListQuery.get({
        "where[category][equals]": String(categoryId),
        depth: 2,
        locale,
      }),
    enabled: !!categoryId,
  });

  if (isLoading) return null;
  if (error || !item) return null;

  const heroImage =
    item.preveiw && typeof item.preveiw === "object" ? item.preveiw.url : null;
  const portraitImage =
    item.galleryPortrait && typeof item.galleryPortrait === "object"
      ? item.galleryPortrait.url
      : null;
  const landscapeImage =
    item.galleryLandscape && typeof item.galleryLandscape === "object"
      ? item.galleryLandscape.url
      : null;
  const sectorTitle =
    item.category && typeof item.category === "object" ? item.category.title : null;
  const serviceCategoryTitle =
    item.serviceCategory && typeof item.serviceCategory === "object"
      ? item.serviceCategory.title
      : null;

  const relatedItems = (relatedMatches ?? [])
    .filter((r) => r.id !== item.id)
    .slice(0, 3);

  return (
    <div>
      {/* ---- HERO ---- */}
      {/* Figma node 121:30 — 474px tall at 1440px canvas */}
      <section className="relative min-h-[474px] flex items-center justify-center">
        {heroImage && (
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            className="object-cover -z-10"
          />
        )}
        <div className="absolute inset-0 bg-black/50 -z-10" />

        <RealisationContainer>
          <div className="flex flex-col gap-3 items-center text-center max-w-[850px] mx-auto">
            <p className="text-sm uppercase tracking-wide text-white">Projet</p>
            <h1 className="font-semibold text-4xl md:text-[48px] leading-[1.1] tracking-[-0.025em] text-white">
              {item.title}
            </h1>
          </div>
        </RealisationContainer>
      </section>

      {/* ---- OVERVIEW + METADATA CARD + ENJEUX ---- */}
      <section className="bg-[#FBF3EA] py-16 md:py-[120px]">
        <RealisationContainer>
          {/* Figma node 121:36 — 813.33 : 394.67 column ratio, 24px gap */}
          <div className="grid grid-cols-1 md:grid-cols-[813fr_395fr] gap-6">
            <div className="text-base leading-[1.5] text-[#212121] [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-6 [&_h2]:mb-3 [&_p+p]:mt-3">
              {item.content && <RichText data={item.content} />}
            </div>

            {/* Figma node 121:38 — 16px horizontal / 20px vertical card padding */}
            <div className="bg-white border border-[#E5E7EB] divide-y divide-[#E5E7EB] self-start px-4 py-5">
              {item.client && <MetaRow label="Client" value={item.client} />}
              {serviceCategoryTitle && (
                <MetaRow label="Catégorie" value={serviceCategoryTitle} />
              )}
              {sectorTitle && <MetaRow label="Secteur" value={sectorTitle} />}
              {item.duration && (
                <MetaRow label="Durée du projet" value={item.duration} />
              )}
              {item.status && (
                <MetaRow
                  label="Statut"
                  value={STATUS_LABELS[item.status] ?? item.status}
                />
              )}
            </div>
          </div>

          {/* ---- ENJEUX DU CHANTIER ---- */}
          {/* Figma node 121:55 — full 1232px width, 48px below the grid above,
              48px above the gallery below. NOT nested inside the text column. */}
          {item.challenges && item.challenges.length > 0 && (
            <div className="mt-12">
              <h2 className="font-bold text-2xl text-[#212121] mb-3">
                Enjeux du chantier
              </h2>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                {item.challenges.map((c, i) => (
                  <li key={i} className="text-base leading-[1.5] text-[#212121]">
                    {c.text}
                  </li>
                ))}
              </ul>
              {/* "Ce chantier illustre..." — moved out of `content`, renders
                  after the bullets per Figma, not before Enjeux du chantier */}
              {item.closingParagraph && (
                <p className="text-base leading-[1.5] text-[#212121] mt-4">
                  {item.closingParagraph}
                </p>
              )}
            </div>
          )}

          {/* ---- GALLERY ---- */}
          {/* Figma node 121:59 — equal 500px / 500px columns, 24px gap.
              Landscape image is 500x349.86 (~10:7), not 4:3. */}
          {(portraitImage || landscapeImage) && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6 mt-6">
              {portraitImage && (
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={portraitImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}
              {landscapeImage && (
                <div className="relative aspect-[10/7] overflow-hidden">
                  <Image
                    src={landscapeImage}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </RealisationContainer>
      </section>

      {/* ---- PLUS DE RÉALISATIONS ---- */}
      {!relatedLoading && relatedItems.length > 0 && (
        <section className="bg-[#1E1E1E] py-16 md:py-[120px]">
          <RealisationContainer>
            <h2 className="font-semibold text-[28px] md:text-[48px] leading-[1.1] tracking-[-0.025em] text-[#D97724] text-center mb-12">
              Plus de réalisations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {relatedItems.map((related) => {
                const imgUrl =
                  related.preveiw && typeof related.preveiw === "object"
                    ? related.preveiw.url
                    : null;
                if (!imgUrl) return null;
                return (
                  <Link
                    key={related.id}
                    href={`/realisations/${related.slug ?? ""}`}
                    className="relative aspect-[4/3] overflow-hidden group block"
                  >
                    <Image
                      src={imgUrl}
                      alt={related.title ?? ""}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/realisations"
                className="text-white text-sm font-medium hover:underline"
              >
                Tout voir
              </Link>
            </div>
          </RealisationContainer>
        </section>
      )}

      <CtaBanner />
    </div>
  );
}