"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { homeQuery } from "@/hooks/home/homeQuery";
import FetchError from "@/components/errors";
import { PartnerLogos } from "@/components/PartnerLogos";
import { Intro } from "@/components/Intro";
import { Trades } from "@/components/Trades";
import { Gallery } from "@/components/Gallery";
import { Sectors } from "@/components/Sector";
import { Faq } from "@/components/Faq";
import { CtaBanner } from "@/components/CtaBanner";
import { Container } from "@/components/Container";


const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["home", LOCALE],
    queryFn: () => homeQuery.getBlobal({ depth: 2, locale: LOCALE }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return <FetchError error={error} />;
  }

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="relative min-h-screen flex items-end">
        {data?.heroImage && typeof data.heroImage === "object" && (
  <Image
    src={data.heroImage.url}
    alt={data.heroImage.alt ?? ""}
    fill
    priority
    className="object-cover -z-10"
  />
        )}
        <div className="absolute inset-0 bg-black/30 -z-10" />

      <div className="relative w-full">
  <Container className="pb-16">
    <div className="max-w-xl text-white">
      <h1 className="font-semibold text-6xl leading-[1.1] tracking-tight mb-4">
        {data?.heroTitle}
      </h1>

      <p className="font-[family-name:var(--font-inter)] font-normal text-base leading-normal tracking-normal text-[#EBEBEB] mb-6">
        {data?.heroContent}
      </p>

      <div className="flex gap-3">
        <Link
          href="/quote"
          className="bg-[#D97B2C] text-[#212121] px-4 py-1 h-[52px] flex items-center text-sm leading-none font-medium"
 >
          {data?.heroCTA}
        </Link>

        <Link
          href="/realisations"
          className="bg-[#1c1c1c] border border-[#FBF3EA] px-4 py-1 h-[52px] flex items-center text-sm leading-none font-medium"

        >
          {data?.heroCTA2}
        </Link>
      </div>
    </div>
  </Container>
</div>
      </section>
       <PartnerLogos />
       <Intro />
        <Trades />
        <section className="relative h-[500px] md:h-[600px]">
  <Image
    src="/trades-banner.webp"
    alt="67 Design & Build — chantier"
    fill
    className="object-cover"
  />
</section>
<Gallery />
<Sectors />
<Faq />
<CtaBanner />

    </div>
  );
}