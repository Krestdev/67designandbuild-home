"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ctaBannerQuery } from  "@/hooks/cta/ctaQuery";
import type { CtaBannerGlobal } from "@/hooks/cta/type";

const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

export function CtaBanner() {
  const { data, isLoading, error } = useQuery<CtaBannerGlobal>({
    queryKey: ["cta-banner", LOCALE],
    queryFn: () => ctaBannerQuery.getBlobal({ locale: LOCALE }),
  });

  if (isLoading || error || !data) return null;

  return (
    <section className="relative bg-[#1c1c1c] text-white overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-1/2 opacity-20">
        <Image
          src="/cta-blueprint.png"
          alt=""
          fill
          sizes="50vw"
          className="object-cover object-left"
        />
      </div>

      <div className="relative px-6 md:px-8 py-16 md:py-24 max-w-xl">
        <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
          {data.title}
        </h2>
        <p className="text-sm text-white/70 mb-6">{data.content}</p>
        <Link
          href="/quote"
          className="inline-block bg-[#D97B2C] text-[#212121] px-6 py-3 rounded-lg text-sm font-medium"
        >
          {data.cta}
        </Link>
      </div>
    </section>
  );
}