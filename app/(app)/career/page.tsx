"use client";
import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { careerGlobalQuery } from "@/hooks/career/careerGlobalQuery";
import { careerListQuery } from "@/hooks/career/careerListQuery";
import type { CareerGlobal, Career, CareerProfile } from "@/hooks/career/type";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { useLocaleStore } from "@/store/locale-store";
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

export default function CareerPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string | string[] }>;
}) {
  // Deep link: /career?job=<id>#candidature preselects the job
  const initialJob = use(searchParams).job;
  const [filter, setFilter] = useState<CareerProfile | "all">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  // Job preselected in the application form; "" = spontaneous application
  const [selectedJobId, setSelectedJobId] = useState(
    typeof initialJob === "string" ? initialJob : "",
  );
  const { locale, t } = useLocaleStore();

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

  const applyTo = (jobId: number) => {
    setSelectedJobId(String(jobId));
    window.history.replaceState(null, "", `?job=${jobId}#candidature`);
    document
      .getElementById("candidature")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
              {filteredJobs.map((job) => {
                const expanded = expandedId === job.id;
                return (
                  <div key={job.id} className="py-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                      <div className="flex items-center gap-4 shrink-0">
                        {job.content && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(expanded ? null : job.id)
                            }
                            aria-expanded={expanded}
                            aria-controls={`job-${job.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-[#212121] underline underline-offset-4 hover:text-[#D97B2C] transition-colors"
                          >
                            {expanded ? t("collapse") : t("seeDetails")}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => applyTo(job.id)}
                          className="inline-flex items-center gap-1 border border-[#212121] px-4 py-2 text-sm font-medium text-[#212121] hover:bg-[#212121] hover:text-white transition-colors"
                        >
                          {t("apply")} <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {expanded && job.content && (
                      <div
                        id={`job-${job.id}`}
                        className="mt-6 max-w-[800px] text-base leading-[1.5] text-[#333333] [&_h2]:font-semibold [&_h2]:text-2xl [&_h2]:text-[#212121] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:text-[#212121] [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_a]:text-[#D97B2C] [&_a]:underline"
                      >
                        <RichText data={job.content} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* ---- EMPTY STATE ---- */
           <div className="flex flex-col items-center text-center py-16">
  <Image
    src="/empty-career.png"
    alt="The Empty Career State Illustration"
    width={166}
    height={200}
    className="mb-6"
  />
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

      {/* ---- CANDIDATURE ---- */}
      <section id="candidature" className="scroll-mt-8 py-16 md:py-[120px]">
        <CareerContainer>
          <div className="max-w-[720px]">
            <h2 className="font-semibold text-[28px] md:text-[48px] leading-[1.1] tracking-[-0.025em] text-[#212121] mb-1">
              {t("applyTitle")}
            </h2>
            <p className="text-base leading-[1.5] text-[#5B5B5B] mb-8">
              {t("applySubtitle")}
            </p>
            <ApplicationForm
              jobs={jobs}
              jobId={selectedJobId}
              onJobChange={setSelectedJobId}
            />
          </div>
        </CareerContainer>
      </section>
    </div>
  );
}
