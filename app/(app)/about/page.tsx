"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { aboutQuery } from "@/hooks/about/aboutQuery";
import type { AboutGlobal } from "@/hooks/about/type";
import { Container } from "@/components/Container";
import { PartnerLogos } from "@/components/PartnerLogos";
import { CtaBanner } from "@/components/CtaBanner";

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

  const directionPhoto =
    data.direction?.person?.photo && typeof data.direction.person.photo === "object"
      ? data.direction.person.photo.url
      : null;

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

      {/* ---- DIRECTION ---- */}
      <section className="bg-[#212121] py-16 md:py-24">
        <Container>
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="font-semibold text-4xl md:text-5xl leading-[1.1] tracking-[-0.025em] text-white max-w-[640px] mb-4">
                {data.direction?.title}
              </h2>
              <p className="text-base leading-[1.5] text-[#AFAFAF] max-w-[640px]">
                {data.direction?.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_464px] gap-12">
              <div className="flex flex-col gap-2 order-2 md:order-1">
                <h3 className="font-bold text-2xl leading-[1.5] text-white">
                  {data.direction?.person?.name}
                </h3>
                <p className="font-medium text-sm leading-[1.5] text-[#D97B2C] mb-4">
                  {data.direction?.person?.role}
                </p>
                <div className="text-base leading-[1.5] text-white space-y-4">
                  {data.direction?.person?.bio && (
                    <RichText data={data.direction.person.bio} />
                  )}
                </div>
              </div>

              {directionPhoto && (
                <div className="relative w-full aspect-square md:w-[464px] md:h-[464px] order-1 md:order-2 overflow-hidden">
                  <Image
                    src={directionPhoto}
                    alt={data.direction?.person?.name ?? ""}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
      {/* ---- STEPS ---- */}
<section className="bg-[#FBF3EA] py-16 md:py-[120px]">
  <Container>
    <div className="flex flex-col gap-12">
      <div>
        <h2 className="font-semibold text-[28px] md:text-[48px] leading-[1.1] tracking-[-0.025em] text-[#212121] max-w-[640px] mb-4">
          {data.steps?.title}
        </h2>
        <p className="text-sm md:text-base leading-[1.5] text-[#333333] md:text-[#5B5B5B] max-w-[640px]">
          {data.steps?.subtitle}
        </p>
      </div>

      <div className="flex flex-col divide-y divide-[#21212114]">
  {data.steps?.items?.map((step, index) => (
    <div key={step.id} className="flex gap-6 md:gap-10 py-6 first:pt-0 last:pb-0">
      <span className="font-medium text-[32px] leading-[1.1] text-[#AFAFAF] w-8 shrink-0">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-lg leading-[1.1] text-[#212121]">
          {step.title}
        </h3>
        <p className="text-sm leading-[1.5] text-[#333333]">
          {step.description}
        </p>
      </div>
    </div>
  ))}
</div>
    </div>
  </Container>
</section>
{/* ---- GUARANTEES ---- */}
<section className="bg-white py-16 md:py-[120px]">
  <Container>
    <div className="flex flex-col items-center text-center gap-4 mb-12">
      <h2 className="font-semibold text-[28px] md:text-[48px] leading-[1.1] tracking-[-0.025em] text-[#212121] max-w-[640px]">
        {data.guarantees?.title}
      </h2>
      <p className="text-sm md:text-base leading-[1.5] text-[#5B5B5B] max-w-[640px]">
        {data.guarantees?.subtitle}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 border border-[#999999] divide-y md:divide-y-0 md:divide-x divide-[#999999]">
      {data.guarantees?.items?.map((item, index) => (
        <div key={item.id} className="flex flex-col gap-5 pt-4 pb-4 pr-3 pl-3">
          <span className="font-medium text-sm leading-[1.1] text-[#AFAFAF]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg leading-[1.1] text-[#212121]">
              {item.title}
            </h3>
            <p className="text-sm leading-[1.5] text-[#333333]">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </Container>
</section>
<CtaBanner />
    </div>
  );
}