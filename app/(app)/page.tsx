"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { aboutQuery } from "@/hooks/about/aboutQuery";
import type { AboutGlobal } from "@/hooks/about/type";
import { Container } from "@/components/Container";
import { PartnerLogos } from "@/components/PartnerLogos";

const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

export default function AboutPage() {
  const { data, isLoading, error } = useQuery<AboutGlobal>({
    queryKey: ["about", LOCALE],
    queryFn: () => aboutQuery.getBlobal({ locale: LOCALE }),
  });

  if (isLoading || error || !data) return null;

  const heroImage =
    data.hero?.backgroundImage && typeof data.hero.backgroundImage === "object"
      ? data.hero.backgroundImage.url
      : null;

  const heroImageAlt =
    data.hero?.backgroundImage && typeof data.hero.backgroundImage === "object"
      ? data.hero.backgroundImage.alt ?? ""
      : "";

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="relative min-h-[409.6px]">
        {heroImage && (
          <Image
            src={heroImage}
            alt={heroImageAlt}
            fill
            priority
            className="object-cover -z-10"
          />
        )}
        <div className="absolute inset-0 bg-black/30 -z-10" />

        <div className="relative flex flex-col justify-end py-24 md:py-[120px]">
          <Container>
            <div className="flex flex-col gap-10 items-center text-center">
              <h1 className="font-semibold text-4xl md:text-[60px] leading-[1.1] tracking-[-0.025em] text-white max-w-[720px]">
                {data.hero?.title}
              </h1>

              <p className="text-base leading-[1.5] text-[#EBEBEB] max-w-[720px]">
                {data.hero?.subtitle}
              </p>
            </div>
          </Container>
        </div>
      </section>

      {/* ---- INTRO / STATS ---- */}
      <section className="bg-[#FAF3EA] py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-12 md:grid md:grid-cols-4 md:gap-12">
            <p className="order-2 md:order-1 md:col-span-3 font-semibold text-lg md:text-[28px] leading-[1.5] text-[#212121]">
              {data.content && <RichText data={data.content} />}
            </p>

            <span className="order-1 md:order-2 md:col-start-4 font-bold text-xl md:text-[32px] leading-[1.1] tracking-[-0.025em] uppercase text-[#D97B2C] md:text-right">
              {data.introExtras?.eyebrow}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6 mt-12">
            {data.introExtras?.stats?.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-2">
                <span className="font-medium text-5xl md:text-[96px] leading-[1.1] text-[#D97B2C]">
                  {stat.value}
                </span>
                <span className="text-base leading-[1.5] text-[#212121]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <PartnerLogos />
    </div>
  );
}