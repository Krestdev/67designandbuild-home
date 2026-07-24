"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { serviceQuery } from "@/hooks/service/serviceQuery";
import { serviceListQuery } from "@/hooks/service/serviceListQuery";
import type { ServicePageGlobal, Service } from "@/hooks/service/type";


const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

export function Trades() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: intro, isLoading: introLoading } = useQuery<ServicePageGlobal>({
    queryKey: ["service-intro", LOCALE],
    queryFn: () => serviceQuery.getBlobal({ locale: LOCALE }),
  });

  const { data: services, isLoading: listLoading } = useQuery<Service[]>({
    queryKey: ["services", LOCALE],
    queryFn: () => serviceListQuery.get({ depth: 1, locale: LOCALE }),
  });

  if (introLoading || listLoading || !services || services.length === 0) return null;

  const active = services[activeIndex];
  const activeImage =
    active?.preveiw && typeof active.preveiw === "object" ? active.preveiw.url : null;

  return (
    <section className="grid md:grid-cols-2 gap-10 px-6 md:px-8 py-16 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{intro?.title}</h2>
        <p className="text-sm text-[#1c1c1c]/70 mb-6">{intro?.intro}</p>

        {activeImage && (
          <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
            <Image
              src={activeImage}
              alt={active.title ?? ""}
              fill
              className="object-cover"
            />
          </div>
        )}

        {active?.content && (
          <div className="text-sm text-[#1c1c1c]/70">
            <RichText data={active.content} />
          </div>
        )}
      </div>

      <ul className="divide-y divide-[#1c1c1c]/10">
        {services.map((service, i) => (
          <li key={service.id}>
            <button
              onClick={() => setActiveIndex(i)}
              className={`w-full text-left py-4 font-medium transition-colors ${
                i === activeIndex
                  ? "text-[#1c1c1c]"
                  : "text-[#1c1c1c]/60 hover:text-[#1c1c1c]"
              }`}
            >
              {service.title}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}