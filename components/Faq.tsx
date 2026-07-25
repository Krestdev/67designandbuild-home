"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ChevronDown } from "lucide-react";
import { faqQuery } from "@/hooks/faq/faqQuery";
import { faqListQuery } from "@/hooks/faq/faqListQuery";
import type { FaqPageGlobal, Faq as FaqEntry } from "@/hooks/faq/type";

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
    <section className="max-w-2xl mx-auto px-6 md:px-8 py-16 md:py-24 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-10">{intro?.title}</h2>

      <div className="text-left divide-y divide-[#1c1c1c]/10 border-t border-b border-[#1c1c1c]/10">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}>
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-medium">{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="pb-5 text-sm text-[#1c1c1c]/70">
                  <RichText data={item.answer} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
