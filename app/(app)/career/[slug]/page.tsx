"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ArrowUpRight } from "lucide-react";
import { careerGlobalQuery } from "@/hooks/career/careerGlobalQuery";
import { careerListQuery } from "@/hooks/career/careerListQuery";
import { contactQuery } from "@/hooks/contact/contactQuery";
import type { Career, CareerGlobal, CareerProfile } from "@/hooks/career/type";
import type { ContactGlobal } from "@/hooks/contact/type";
import { CtaBanner } from "@/components/CtaBanner";
import { useLocaleStore } from "@/store/locale-store";
import type { MessageKey } from "@/providers/messages";

function CareerContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-6">{children}</div>;
}

const PROFILE_KEYS: Record<CareerProfile, MessageKey> = {
  "chantier-production": "profileChantier",
  "bureau-etudes": "profileBureau",
};

const CONTRACT_KEYS: Record<string, MessageKey> = {
  cdi: "contractCdi",
  cdd: "contractCdd",
  stage: "contractStage",
};

export default function CareerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { locale, t } = useLocaleStore();

  const {
    data: matches,
    isLoading,
    error,
  } = useQuery<Career[]>({
    queryKey: ["career", slug, locale],
    queryFn: () =>
      careerListQuery.get({
        "where[slug][equals]": slug,
        locale,
      }),
  });

  // Hero image comes from the Careers page global — job offers have none.
  const { data: intro } = useQuery<CareerGlobal>({
    queryKey: ["career-global", locale],
    queryFn: () => careerGlobalQuery.getBlobal({ locale }),
  });

  const { data: contact } = useQuery<ContactGlobal>({
    queryKey: ["contact", locale],
    queryFn: () => contactQuery.getBlobal({ locale }),
  });

  const job = matches?.[0];

  if (isLoading) return null;
  if (error) return null;
  if (!job) notFound();

  const heroImage =
    intro?.heroImage && typeof intro.heroImage === "object"
      ? intro.heroImage.url
      : null;

  const subject = `${t("applySubject")} - ${job.title ?? ""}`;
  const applyHref = contact?.email
    ? `mailto:${contact.email}?subject=${encodeURIComponent(subject)}`
    : "/contact";

  const meta = [
    job.profile && t(PROFILE_KEYS[job.profile]),
    job.contractType && CONTRACT_KEYS[job.contractType]
      ? t(CONTRACT_KEYS[job.contractType])
      : job.contractType,
    job.location,
  ].filter(Boolean);

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="relative min-h-[409.6px] flex items-center justify-center">
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

        <CareerContainer>
          <div className="flex flex-col gap-3 items-center text-center max-w-[720px] mx-auto">
            <h1 className="font-semibold text-4xl md:text-[60px] leading-[1.1] tracking-[-0.025em] text-white">
              {job.title}
            </h1>
            <p className="text-base leading-[1.5] text-[#EBEBEB]">
              {meta.join(" • ")}
            </p>
          </div>
        </CareerContainer>
      </section>

      {/* ---- CONTENT ---- */}
      <section className="bg-[#FBF3EA] py-16 md:py-[120px]">
        <CareerContainer>
          <div className="max-w-[820px] mx-auto">
            <div className="text-base leading-[1.5] text-[#212121] [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mt-5 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_p+p]:mt-3">
              {job.content && <RichText data={job.content} />}
            </div>

            <div className="flex flex-wrap gap-3 mt-10">
              <a
                href={applyHref}
                className="inline-flex items-center gap-1 bg-[#212121] text-white px-4 py-2 text-sm font-medium"
              >
                {t("apply")} <ArrowUpRight className="w-4 h-4" />
              </a>
              <Link
                href="/career"
                className="inline-flex items-center border border-[#212121] px-4 py-2 text-sm font-medium text-[#212121] hover:bg-[#212121] hover:text-white transition-colors"
              >
                {t("allJobOffers")}
              </Link>
            </div>
          </div>
        </CareerContainer>
      </section>

      <CtaBanner />
    </div>
  );
}
