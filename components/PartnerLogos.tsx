"use client";
import { useQuery } from "@tanstack/react-query";
import { Partner } from "@/types";
import { partnerListQuery } from "@/hooks/partner/partnerListQuery";
import { Container } from "./Container";
import { useLocale } from "@/providers/localeProvider";

export function PartnerLogos() {
  const { locale } = useLocale();
  const { data, isLoading, error } = useQuery({
    queryKey: ["partners", locale],
    queryFn: () => partnerListQuery.get({ depth: 1, locale }),
  });

  if (isLoading || error || !data || data.length === 0) return null;

  const logos = [...data, ...data];

  return (
    <section className="overflow-hidden py-10 bg-[#FBF3EA]">
      <Container>
        <div className="flex gap-6 w-max animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
          {logos.map((partner: Partner, i) => {
            const logoUrl =
              typeof partner.logo === "object" ? partner.logo.url : null;
            if (!logoUrl) return null;

            const content = (
              <img
                src={logoUrl}
                alt={partner.title}
                className="block h-6 w-[110px] object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition"
              />
            );

            return (
              <div key={`${partner.id}-${i}`} className="flex items-center">
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
      </Container>
    </section>
  );
}