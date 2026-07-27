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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-center mb-14">
            {intro?.title}
          </h2>

          <div className="border-t border-[#212121]/10">
            {items.map((item) => {
              const isOpen = openId === item.id;

              return (
                <div
                  key={item.id}
                  className="border-b border-[#212121]/10"
                >
                  <button
                    onClick={() =>
                      setOpenId(isOpen ? null : item.id)
                    }
                    className="w-full flex items-start justify-between gap-6 py-6 text-left transition-colors duration-300"
                  >
                    <span className="text-xl md:text-2xl font-medium leading-snug">
                      {item.question}
                    </span>

                    <span className="flex-shrink-0 text-4xl font-light leading-none">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "max-h-96 opacity-100 pb-6"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pr-12 text-base leading-8 text-[#212121]/70">
                      <RichText data={item.answer} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}