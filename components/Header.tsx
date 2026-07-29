"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navbarQuery } from "@/hooks/nav/navQuery";
import { serviceListQuery } from "@/hooks/service/serviceListQuery";
import { sectorListQuery } from "@/hooks/sector/sectorListQuery";
import { ChevronDown, ArrowUpRight, Menu } from "lucide-react";
import { MobileMenu } from "@/components/nav/MobileMenu";

const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

// Same 24px-at-all-breakpoints finding confirmed on the About page — now
// also confirmed here via Figma MCP. Container's md:px-8 (32px) over-pads
// the navbar at desktop too. Using a local wrapper until this is resolved
// globally in Container.
function NavContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-6">{children}</div>;
}

const navItemClass =
  "flex items-center justify-center min-h-[36px] p-1 font-medium text-sm text-white whitespace-nowrap";

type DropdownKey = "services" | "sectors" | null;

// PLACEHOLDER STYLING — no Figma spec yet for the Desktop dropdown panel
// (only Mobile frame screenshots provided so far). Mirrors the mobile
// panel's confirmed #212121 bg + white/10 divider as a reasonable default.
// Replace positioning/spacing once Desktop frame is shared.
function NavDropdown<
  T extends { id: number; title?: string | null; slug?: string | null },
>({
  label,
  items,
  basePath,
  isOpen,
  onToggle,
}: {
  label?: string | null;
  items: T[] | undefined;
  basePath: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`${navItemClass} gap-1 cursor-pointer`}
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 min-w-[260px] rounded-lg bg-[#212121] py-2 shadow-lg">
          {(items ?? []).map((item, idx) =>
            item.slug ? (
              <Link
                key={item.id}
                href={`${basePath}/${item.slug}`}
                className={`block px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/5 ${
                  idx > 0 ? "border-t border-white/10" : ""
                }`}
              >
                {item.title}
              </Link>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const navRef = useRef<HTMLElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["navbar", LOCALE],
    queryFn: () => navbarQuery.getBlobal({ locale: LOCALE }),
  });

  const { data: services } = useQuery({
    queryKey: ["services-nav", LOCALE],
    queryFn: () => serviceListQuery.get({ locale: LOCALE }),
    enabled: openDropdown === "services",
  });

  const { data: sectors } = useQuery({
    queryKey: ["sectors-nav", LOCALE],
    queryFn: () => sectorListQuery.get({ locale: LOCALE }),
    enabled: openDropdown === "sectors",
  });

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  if (isLoading || error || !data) return null;

  return (
    <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-[12px]"
    >
      <NavContainer>
        <div className="flex h-[80px] items-center justify-between">
          <Link href="/">
            <Image
              src="/logofooter.png"
              alt="67 Design & Build"
              width={195}
              height={40}
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/about"
              className={`${navItemClass} ${pathname === "/about" ? "underline" : ""}`}
            >
              {data.aboutUs}
            </Link>

            <NavDropdown
              label={data.services}
              items={services}
              basePath="/services"
              isOpen={openDropdown === "services"}
              onToggle={() =>
                setOpenDropdown((cur) =>
                  cur === "services" ? null : "services",
                )
              }
            />

            <NavDropdown
              label={data.sectors}
              items={sectors}
              basePath="/sector"
              isOpen={openDropdown === "sectors"}
              onToggle={() =>
                setOpenDropdown((cur) => (cur === "sectors" ? null : "sectors"))
              }
            />

            <Link href="/realisations" className={navItemClass}>
              Réalisations
            </Link>

            <Link href="/blog" className={navItemClass}>
              {data.blogs}
            </Link>

            <Link href="/career" className={navItemClass}>
              {data.careers}
            </Link>

            <span className={`${navItemClass} gap-2 px-2 py-1 cursor-pointer`}>
              FR <ChevronDown className="w-4 h-4" />
            </span>

            <Link href="/contact" className={`${navItemClass} gap-2`}>
              {data.contact} <ArrowUpRight className="w-4 h-4" />
            </Link>
          </nav>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </NavContainer>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        data={data}
      />
    </header>
  );
}
