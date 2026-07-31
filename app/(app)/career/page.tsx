"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { careerGlobalQuery } from "@/hooks/career/careerGlobalQuery";
import { careerListQuery } from "@/hooks/career/careerListQuery";
import type { CareerGlobal, Career, CareerProfile } from "@/hooks/career/type";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "@/providers/localeProvider";
import type { MessageKey } from "@/providers/messages";

function CareerContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-6">{children}</div>;
}

const FILTER_KEYS: { key: MessageKey; value: CareerProfile | "all" }[] = [
  { key: "filterAllProfiles", value: "all" },
  { key: "filterChantier", value: "chantier-production" },
  { key: "filterBureau", value: "bureau-etudes" },
];

const PROFILE_KEYS: Record<CareerProfile, MessageKey> = {
  "chantier-production": "profileChantier",
  "bureau-etudes": "profileBureau",
};

const CONTRACT_KEYS: Record<string, MessageKey> = {
  cdi: "contractCdi",
  cdd: "contractCdd",
  stage: "contractStage",
};

export default function CareerPage() {
  const [filter, setFilter] = useState<CareerProfile | "all">("all");
  const { locale, t } = useLocale();

  const {
    data: intro,
    isLoading: introLoading,
    error: introError,
  } = useQuery<CareerGlobal>({
    queryKey: ["career-global", locale],
    queryFn: () => careerGlobalQuery.getBlobal({ locale }),
  });

  const {
    data: careers,
    isLoading: listLoading,
    error: listError,
  } = useQuery<Career[]>({
    queryKey: ["careers", locale],
    queryFn: () => careerListQuery.get({ locale }),
  });

  if (introLoading || listLoading) return null;
  if (introError || listError || !intro) return null;

  const jobs = careers ?? [];
  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((job) => job.profile === filter);

  const heroImage =
    intro.heroImage && typeof intro.heroImage === "object"
      ? intro.heroImage.url
      : null;

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
        <div className="absolute inset-0 bg-black/40 -z-10" />

        <CareerContainer>
          <div className="flex flex-col gap-3 items-center text-center max-w-[720px] mx-auto">
            <h1 className="font-semibold text-4xl md:text-[60px] leading-[1.1] tracking-[-0.025em] text-white">
              {intro.heroTitle}
            </h1>
            <p className="text-base leading-[1.5] text-[#EBEBEB]">
              {intro.heroSubtitle}
            </p>
          </div>
        </CareerContainer>
      </section>

      {/* ---- POSTES OUVERTS ---- */}
      <section className="bg-[#FBF3EA] py-16 md:py-[120px]">
        <CareerContainer>
          <h2 className="font-semibold text-[28px] md:text-[48px] leading-[1.1] tracking-[-0.025em] text-[#212121] mb-1">
            {intro.listTitle}
          </h2>
          <p className="text-base leading-[1.5] text-[#5B5B5B] mb-8">
            {intro.listSubtitle}
          </p>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {FILTER_KEYS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  filter === f.value
                    ? "bg-[#212121] text-white"
                    : "bg-[#FFF0DF] text-[#212121] border border-[#EDD3B7]"
                }`}
              >
                {t(f.key)}
              </button>
            ))}
          </div>

          {filteredJobs.length > 0 ? (
            <div className="flex flex-col divide-y divide-[#21212114] border-t border-[#21212114]">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between gap-4 py-6"
                >
                  <div>
                    <h3 className="font-medium text-lg text-[#212121] mb-1">
                      {job.title}
                    </h3>
                    <p className="text-sm text-[#5B5B5B]">
                      {job.profile && t(PROFILE_KEYS[job.profile])} •{" "}
                      {job.contractType && CONTRACT_KEYS[job.contractType]
                        ? t(CONTRACT_KEYS[job.contractType])
                        : job.contractType} •{" "}
                      {job.location}
                    </p>
                  </div>
                  <a
                    href={`/career/${job.slug ?? ""}`}
                    className="shrink-0 inline-flex items-center gap-1 border border-[#212121] px-4 py-2 text-sm font-medium text-[#212121] hover:bg-[#212121] hover:text-white transition-colors"
                  >
                    {t("apply")} <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            /* ---- EMPTY STATE ---- */
            <div className="flex flex-col items-center text-center py-16">
              {/* TODO: replace with the illustrated folder/paper-airplane
                  graphic from Figma — no exportable asset pulled yet */}
              <div className="w-24 h-24 mb-6 bg-[#EDD3B7]/40 rounded-full" />
              <h3 className="font-semibold text-2xl text-[#212121] mb-2">
                {intro.emptyStateTitle}
              </h3>
              <p className="text-base text-[#AFAFAF] max-w-md">
                {intro.emptyStateSubtitle}
              </p>
            </div>
          )}
        </CareerContainer>
      </section>
    </div>
  );
}
