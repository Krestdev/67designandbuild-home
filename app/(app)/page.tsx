"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { homeQuery } from "@/hooks/home/homeQuery";
import FetchError from "@/components/errors";

const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["home", LOCALE],
    queryFn: () => homeQuery.getBlobal({ depth: 2, locale: LOCALE }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return <FetchError error={error} />;
  }

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="relative h-[1024px] flex items-end">
        {data?.heroImage && typeof data.heroImage === "object" && (
  <Image
    src={data.heroImage.url}
    alt={data.heroImage.alt ?? ""}
    fill
    priority
    className="object-cover -z-10"
  />
        )}
        <div className="absolute inset-0 bg-black/30 -z-10" />

        <div className="relative px-8 pb-16 max-w-xl text-white">
          <h1 className="text-4xl font-semibold font- leading-tight mb-4 text-6xl ">
            {data?.heroTitle}
          </h1>
          <p className="text-mb mb-6 text-white/90">{data?.heroContent}</p>
          <div className="flex gap-3">
            <Link
              href="/quote"
              className="bg-[#D97B2C] text-[#212121] px-6 py-3  text-sm font-medium px-2 py-4"
            >
              {data?.heroCTA}
            </Link>
            <Link
              href="/realisations"
              className="bg-[#1c1c1c] px-6 py-3  text-sm  px-2 py-4 font-medium"
            >
              {data?.heroCTA2}
            </Link>
          </div>
        </div>
      </section>

      {/* rest of the homepage sections come next, once Header/Footer are confirmed */}
      <div className="h-[1000px] bg-white p-8">
        <p>Scroll test content — confirms Header switches to solid background here.</p>
      </div>
    </div>
  );
}