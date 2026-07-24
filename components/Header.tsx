"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { navbarQuery } from "@/hooks/nav/navQuery";
import { ChevronDown } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Menu } from "lucide-react";

const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["navbar", LOCALE],
    queryFn: () => navbarQuery.getBlobal({ locale: LOCALE }),
  });

  if (isLoading || error || !data) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 transition-colors duration-300 ${
        scrolled ? "bg-[#1c1c1c]" : "bg-white/10 backdrop-blur-[24px]"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/">
          <Image src="/logofooter.png" alt="67 Design & Build" width={195} height={40} priority />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white">
          <Link href="/about">{data.aboutUs}</Link>
          <span className="flex items-center gap-1 cursor-pointer">{data.services} <ChevronDown className="w-4 h-4" /> </span>
          <span className="flex items-center gap-1 cursor-pointer">{data.sectors}<ChevronDown className="w-4 h-4" /> </span>
          <Link href="/realisations">Réalisations</Link>
          <Link href="/blog">{data.blogs}</Link>
          <Link href="/career">{data.careers}</Link>
          <span className="inline-flex items-center cursor-pointer gap-0.5">
  FR <ChevronDown className="w-4 h-4" />
</span>
         <Link
  href="/contact"
  className="inline-flex items-center ml-2 rounded-full border border-white/40 px-4 py-2 hover:bg-white/10 transition gap-1"
>
  {data.contact} <ArrowUpRight className="w-4 h-4" />
</Link>
        </nav>

        {/* mobile hamburger — placeholder for Step 3 */}
        <button className="md:hidden text-white text-2xl"><Menu className="w-6 h-6" /></button>
      </div>
    </header>
  );
}