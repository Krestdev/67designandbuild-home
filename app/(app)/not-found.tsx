"use client";
import Link from "next/link";
import { useLocaleStore } from "@/store/locale-store";

// Rendered inside the site layout (header + footer) for unknown URLs and for
// detail pages whose slug doesn't match any document.
export default function NotFound() {
  const { t } = useLocaleStore();

  return (
    <section className="bg-[#FBF3EA] py-24 md:py-[160px]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-4">
        <p className="font-semibold text-[80px] md:text-[120px] leading-none tracking-[-0.025em] text-[#D97B2C]">
          404
        </p>
        <h1 className="font-semibold text-[28px] md:text-[48px] leading-[1.1] tracking-[-0.025em] text-[#212121]">
          {t("notFoundTitle")}
        </h1>
        <p className="text-base leading-[1.5] text-[#5B5B5B] max-w-[480px]">
          {t("notFoundText")}
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center bg-[#212121] text-white px-4 py-2 text-sm font-medium"
        >
          {t("backHome")}
        </Link>
      </div>
    </section>
  );
}
