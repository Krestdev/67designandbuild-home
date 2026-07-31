"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { PlusCircle, CheckCircle2 } from "lucide-react";
import { serviceListQuery } from "@/hooks/service/serviceListQuery";
import type { Service } from "@/hooks/service/type";
import { CtaBanner } from "@/components/CtaBanner";
import { useLocale } from "@/providers/localeProvider";

function ServiceContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-6">{children}</div>;
}

// Reused from Gallery.tsx's card visual/hover behavior — confirmed identical
// by prototyping. TODO: extract into a shared <ProjectCard /> component so
// Gallery and this page don't maintain two copies of the same markup.
function RelatedProjectCard({
  item,
}: {
  item: NonNullable<Service["relatedProjects"]>[number];
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

export default function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { locale } = useLocale();

  const {
    data: services,
    isLoading: serviceLoading,
    error: serviceError,
  } = useQuery<Service[]>({
    queryKey: ["service", slug, locale],
    queryFn: () =>
      serviceListQuery.get({
        "where[slug][equals]": slug,
        depth: 2,
        locale,
      }),
  });

  if (serviceLoading) return null;
  if (serviceError || !services || services.length === 0) {
    return null;
  }

  const service = services[0];
  const relatedProjects = service.relatedProjects ?? [];

  const heroImage =
    service.preveiw && typeof service.preveiw === "object"
      ? service.preveiw.url
      : null;

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="relative min-h-[409.6px]">
        {heroImage && (
          <Image
            src={heroImage}
            alt={service.title ?? ""}
            fill
            priority
            className="object-cover -z-10"
          />
        )}
        <div className="absolute inset-0 bg-black/30 -z-10" />

        <div className="relative flex flex-col justify-end items-center py-[120px]">
          <ServiceContainer>
            <div className="flex flex-col gap-3 items-center text-center max-w-[720px] mx-auto">
              <p className="text-base leading-[1.5] text-[#FFF0DF]">
                Nos Services
              </p>
              <h1 className="font-semibold text-4xl md:text-[60px] leading-[1.1] tracking-[-0.025em] text-white">
                {service.title}
              </h1>
            </div>
          </ServiceContainer>
        </div>
      </section>

      {/* ---- DESCRIPTION ---- */}
      <section className="py-16 md:py-[120px]">
        <ServiceContainer>
          <div className="flex flex-col items-center">
            <div className="max-w-[1024px] text-base leading-[1.5] text-[#212121] text-center">
              {service.content && <RichText data={service.content} />}
            </div>
          </div>

          {/* ---- DOMAINES D'APPLICATION / LIVRABLES ---- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="flex flex-col gap-6 px-3 py-4">
              <h2 className="font-medium text-2xl leading-[1.1] text-[#212121]">
                Domaines d&rsquo;application
              </h2>
              <ul className="flex flex-col gap-1.5">
                {service.applicationAreas?.map((area, i) => (
                  <li key={i} className="flex gap-1.5 items-start">
                    <PlusCircle
                      className="w-5 h-5 shrink-0 mt-0.5"
                      fill="#D97B2C"
                      stroke="white"
                      strokeWidth={1.5}
                    />
                    <span className="text-base leading-[1.5] text-[#333333]">
                      {area.label} : {area.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6 px-3 py-4">
              <h2 className="font-medium text-2xl leading-[1.1] text-[#212121]">
                Livrables
              </h2>
              <ul className="flex flex-col gap-1.5">
                {service.deliverables?.map((item, i) => (
                  <li key={i} className="flex gap-1.5 items-start">
                    <CheckCircle2
                      className="w-5 h-5 shrink-0 mt-0.5"
                      fill="#D97B2C"
                      stroke="white"
                      strokeWidth={1.5}
                    />
                    <span className="text-base leading-[1.5] text-[#333333]">
                      {item.label} : {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ServiceContainer>
      </section>

      {/* ---- PROJETS ASSOCIÉS ---- */}
      {relatedProjects.length > 0 && (
        <section className="py-16 md:py-[120px]">
          <ServiceContainer>
            <h2 className="font-semibold text-[28px] md:text-[48px] leading-[1.1] tracking-[-0.025em] text-[#212121] text-center max-w-[640px] mx-auto mb-12">
              Projets associés
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {relatedProjects.map((item, i) => (
                <RelatedProjectCard key={i} item={item} />
              ))}
            </div>
          </ServiceContainer>
        </section>
      )}

      <CtaBanner />
    </div>
  );
}