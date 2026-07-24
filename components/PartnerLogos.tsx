"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Partner } from "@/types";
import { partnerListQuery } from "@/hooks/partner/partnerListQuery";


const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

export function PartnerLogos() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["partners", LOCALE],
    queryFn: () => partnerListQuery.get({ depth: 1, locale: LOCALE }),
  });

  if (isLoading || error || !data || data.length === 0) return null;

  
  const logos = [...data, ...data];

  return (
    <section className="overflow-hidden py-10 bg-[#FAF3EA]">
      <div className="flex w-max animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
        {logos.map((partner: Partner, i) => {
          const logoUrl =
            typeof partner.logo === "object" ? partner.logo.url : null;
          if (!logoUrl) return null;

          const content = (
            <Image
              src={logoUrl}
              alt={partner.title}
              width={110}
              height={30}
              className="object-contain h-6 w-auto opacity-70 hover:opacity-100 transition"
            />
          );

          return (
            <div key={`${partner.id}-${i}`} className="flex items-center mx-10">
              {partner.link ? (
                <a href={partner.link} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}