"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { FaLinkedin, FaFacebook, FaXTwitter, FaLink } from "react-icons/fa6";
import { footerQuery } from "@/hooks/footer/footerQuery";

const LOCALE = "fr"; // TODO: wire to real locale routing

type FooterLinkItem = { id: string; lable: string };
type SocialLink = { id: string; platform: string; url: string | null };

const socialIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  x: FaXTwitter,
};

export function Footer() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["footer", LOCALE],
    queryFn: () => footerQuery.getBlobal({ locale: LOCALE }),
  });

  if (isLoading || error || !data) return null;

  return (
    <footer className="bg-[#212121] text-white px-6 md:px-8 pt-12 md:pt-16 pb-8">
      <div className="flex flex-col gap-10 md:flex-row md:justify-end md:gap-20 mb-16 md:mb-24 text-sm">
        <div>
          <h4 className="font-semibold mb-4">Entreprise</h4>
          <ul className="space-y-3 text-white/70">
            {data.Enterprise?.map((item) => (
              <li key={item.id}>{item.lable}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Liens utiles</h4>
          <ul className="space-y-3 text-white/70">
            {data.usefullLinks?.map((item) => (
              <li key={item.id}>{item.lable}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
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
                  aria-label={s.platform}
                  className="text-white hover:text-white transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <Image
          src="/logofooter.png"
          alt="67 Design & Build"
          width={480}
          height={100}
          className="w-auto h-14 md:h-20"
        />
      </div>

      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between text-left text-xs text-white/50 max-w-6xl mx-auto">
  <span className="font-[family-name:var(--font-inter)]" >
    © {new Date().getFullYear()} 67 Design & Build. {data.copyrightText}.
  </span>
  <span className="flex gap-3">
    <button className="hover:text-white transition">FR</button>
    <button className="hover:text-white transition">EN</button>
    <button className="hover:text-white transition">IT</button>
  </span>
</div>
    </footer>
  );
}
