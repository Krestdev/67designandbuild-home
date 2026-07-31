"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FaLinkedin, FaFacebook, FaXTwitter, FaLink } from "react-icons/fa6";
import { footerQuery } from "@/hooks/footer/footerQuery";
import { Container } from "@/components/Container";
import { useLocale, LOCALES } from "@/providers/localeProvider";

const socialIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  x: FaXTwitter,
};

export function Footer() {
  const { locale, setLocale, t } = useLocale();
  const { data, isLoading, error } = useQuery({
    queryKey: ["footer", locale],
    queryFn: () => footerQuery.getBlobal({ locale }),
  });

  if (isLoading || error || !data) return null;

  return (
    <footer className="bg-[#212121] text-white pt-12 md:pt-16 pb-8">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:justify-end md:gap-20 mb-16 md:mb-24 text-sm">
          <div>
            <h4 className="font-semibold mb-4">{t("footerCompany")}</h4>
            <ul className="space-y-3 text-white/70">
              {data.Enterprise?.map((item) => (
                <li key={item.id}>{item.lable}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footerLinks")}</h4>
            <ul className="space-y-3 text-white/70">
              {data.usefullLinks?.map((item) => (
                <li key={item.id}>{item.lable}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t("footerContact")}</h4>
            <ul className="space-y-3 text-white/70">
              <li>{data.contactInfo?.contactEmail}</li>
              <li>{data.contactInfo?.contactPhone}</li>
              <li>{data.contactInfo?.contactAddress}</li>
            </ul>
            <div className="flex gap-4 mt-4">
              {data.socialLinks?.map((s) => {
                const Icon = s.platform
                  ? (socialIcons[s.platform.toLowerCase()] ?? FaLink)
                  : FaLink;
                return (
                  <a
                    key={s.id}
                    href={s.url ?? undefined}
                    aria-label={s.platform ?? undefined}
                    className="text-white hover:text-white transition"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="/logofooter.png"
            alt="67 Design & Build"
            width={1232}
            height={253}
            sizes="(max-width: 768px) 100vw, 1232px"
            className="w-full h-auto"
          />
        </div>

        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between text-left text-xs text-white/50 max-w-6xl mx-auto">
          <span className="font-[family-name:var(--font-inter)]">
            © {new Date().getFullYear()} 67 Design & Build. {data.copyrightText}.
          </span>
          <span className="flex gap-3">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLocale(l.code)}
                className={`hover:text-white transition ${
                  l.code === locale ? "text-white" : ""
                }`}
              >
                {l.label}
              </button>
            ))}
          </span>
        </div>
      </Container>
    </footer>
  );
}
