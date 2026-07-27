"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { faqQuery } from "@/hooks/faq/faqQuery";
import { faqListQuery } from "@/hooks/faq/faqListQuery";
import type { FaqPageGlobal, Faq as FaqEntry } from "@/hooks/faq/type";
import { Container } from "@/components/Container";

const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

export function Faq() {
  const [openId, setOpenId] = useState<number | null>(1);

  const {
    data: intro,
    isLoading: introLoading,
    error: introError,
  } = useQuery<FaqPageGlobal>({
    queryKey: ["faq-intro", LOCALE],
    queryFn: () => faqQuery.getBlobal({ locale: LOCALE }),
  });

  const {
    data: items,
    isLoading: listLoading,
    error: listError,
  } = useQuery<FaqEntry[]>({
    queryKey: ["faqs", LOCALE],
    queryFn: () => faqListQuery.get({ locale: LOCALE }),
  });

  if (introLoading || listLoading) return null;

  if (introError || listError) {
    console.error("Faq section failed to load:", introError ?? listError);
    return null;
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[#FAF6EF]">
      <Container>
        <h2 className="font-semibold text-5xl leading-[1.1] tracking-[-0.025em] text-[#212121] text-center mb-14 max-w-[640px] mx-auto">
          {intro?.title}
        </h2>

        <div className="max-w-[1024px] mx-auto border-t border-white/30">
          {items.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div key={item.id} className="border-b border-white/30">
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex flex-col gap-1.5 p-4 text-left transition-colors duration-300"
                >
                  <div className="flex items-start justify-between gap-6">
                    <span className="text-2xl leading-[1.5] font-medium text-[#212121]">
                      {item.question}
                    </span>

                    <span className="relative w-[18px] h-[18px] flex-shrink-0 mt-2">
                      <span className="absolute top-1/2 left-0 w-full h-[1.5px] -translate-y-1/2 bg-[#212121]" />
                      <span
                        className={`absolute top-1/2 left-0 w-full h-[1.5px] -translate-y-1/2 bg-[#212121] transition-transform duration-300 ${
                          isOpen ? "rotate-0" : "rotate-90"
                        }`}
                      />
                    </span>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pr-12 text-base leading-8 text-[#212121]/70">
                      <RichText data={item.answer} />
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}