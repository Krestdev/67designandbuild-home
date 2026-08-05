"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { serviceQuery } from "@/hooks/service/serviceQuery";
import { serviceListQuery } from "@/hooks/service/serviceListQuery";
import type { ServicePageGlobal, Service } from "@/hooks/service/type";
import { Container } from "./Container";
import { useLocaleStore } from "@/store/locale-store";

export function Trades() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { locale } = useLocaleStore();

  const {
    data: intro,
    isLoading: introLoading,
    error: introError,
  } = useQuery<ServicePageGlobal>({
    queryKey: ["service-intro", locale],
    queryFn: () => serviceQuery.getBlobal({ locale }),
  });

  const {
    data: services,
    isLoading: listLoading,
    error: listError,
  } = useQuery<Service[]>({
    queryKey: ["services", locale],
    queryFn: () => serviceListQuery.get({ depth: 1, locale }),
  });

  if (introLoading || listLoading) return null;

  if (introError || listError) {
    console.error("Trades section failed to load:", introError ?? listError);
    return null;
  }

  if (!services || services.length === 0) return null;

  const active = services[activeIndex];
  const activeImage =
    active?.preveiw && typeof active.preveiw === "object"
      ? active.preveiw.url
      : null;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid gap-6 md:grid-cols-[464px_1fr]">
          <div className="md:col-start-1 md:row-start-1">
            <h2 className="font-semibold text-[28px] md:text-5xl leading-[1.1] tracking-[-0.025em] text-[#212121] mb-4 md:max-w-[640px]">
              {intro?.title}
            </h2>
            <p className="text-base leading-[1.5] text-[#333333] md:text-[#5B5B5B] mb-6 md:max-w-[640px]">
              {intro?.intro}
            </p>
          </div>

          <div className="md:col-start-1 md:row-start-2">
            {activeImage && (
              <div className="relative w-full h-[464px] mb-4 overflow-hidden">
                <Image
                  src={activeImage}
                  alt={active?.title ?? ""}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {active?.content && (
              <div className="text-base leading-[1.5] text-[#333333]">
                <RichText data={active.content} />
              </div>
            )}
          </div>

          <ul className="divide-y divide-[#AFAFAF] border-y border-[#AFAFAF] md:col-start-2 md:row-start-2">
            {services.map((service, i) => (
              <li key={service.id}>
                <button
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  className={`w-full min-h-16 flex items-center text-left py-5 px-3 text-xl md:text-2xl leading-[1.1] font-medium transition-all duration-300 ${
                    i === activeIndex
                      ? "bg-[#FFF0DF] text-[#212121]"
                      : "text-[#212121]/70 hover:bg-[#FFF0DF]/50"
                  }`}
                >
                  {service.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
