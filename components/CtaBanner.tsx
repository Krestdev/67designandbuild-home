"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { ctaBannerQuery } from "@/hooks/cta/ctaQuery";
import type { CtaBannerGlobal } from "@/hooks/cta/type";
import { Container } from "@/components/Container";
import { useLocale } from "@/providers/localeProvider";

export function CtaBanner() {
  const { locale } = useLocale();
  const { data, isLoading, error } = useQuery<CtaBannerGlobal>({
    queryKey: ["cta-banner", locale],
    queryFn: () => ctaBannerQuery.getBlobal({ locale }),
  });

  if (isLoading || error || !data) return null;

  return (
    <section className="relative bg-[#212121] text-white overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-1/2 opacity-20">
        <Image
          src="/cta-blueprint.png"
          alt=""
          fill
          sizes="50vw"
          className="object-cover object-left"
        />
      </div>

      <Container className="relative py-16 md:py-24">
        <div className="flex flex-col gap-12">
          <h2 className="text-[28px] md:text-[80px] font-semibold leading-[1.1] tracking-[-0.025em] max-w-[1232px]">
            {data.title}
          </h2>

          <div className="flex flex-col gap-6">
            <p className="text-base leading-[1.5] text-[#AFAFAF] max-w-[640px]">
              {data.content}
            </p>

           <Link
  href="/quote"
  className="self-start bg-[#D97B2C] text-[#212121] px-4 py-1 h-[52px] flex items-center justify-center text-sm leading-none font-medium"
>
  {data.cta}
</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}