"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navbarQuery } from "@/hooks/nav/navQuery";
import { ChevronDown, ArrowUpRight, Menu } from "lucide-react";

const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

// Same 24px-at-all-breakpoints finding confirmed on the About page — now
// also confirmed here via Figma MCP. Container's md:px-8 (32px) over-pads
// the navbar at desktop too. Using a local wrapper until this is resolved
// globally in Container.
function NavContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-6">{children}</div>;
}

const navItemClass = "flex items-center justify-center min-h-[36px] p-1 font-medium text-sm text-white whitespace-nowrap";

export function Header() {
  const pathname = usePathname();

  const { data, isLoading, error } = useQuery({
    queryKey: ["navbar", LOCALE],
    queryFn: () => navbarQuery.getBlobal({ locale: LOCALE }),
  });

  if (isLoading || error || !data) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-[12px]">
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

            <span className={`${navItemClass} gap-1 cursor-pointer`}>
              {data.services} <ChevronDown className="w-4 h-4" />
            </span>

            <span className={`${navItemClass} gap-1 cursor-pointer`}>
              {data.sectors} <ChevronDown className="w-4 h-4" />
            </span>

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

          <button className="md:hidden text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </NavContainer>
    </header>
  );
}