"use client";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { aboutQuery } from "@/hooks/about/aboutQuery";
import type { AboutGlobal } from "@/hooks/about/type";
import { getPlainTextFromRichText } from "@/lib/getPlainTextFromRichText";
import { Container } from "./Container";

const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

const GREY = "#AFAFAF"; // not-yet-revealed — sampled from the Figma export
const DARK = "#212121"; // revealed — matches the site's existing dark tone

function Word({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const color = useTransform(progress, [start, end], [GREY, DARK]);

  return (
    <motion.span
      style={{ color }}
      className="mr-[0.3em] inline-block font-semibold"
    >
      {word}
    </motion.span>
  );
}

export function Intro() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery<AboutGlobal>({
    queryKey: ["about", LOCALE],
    queryFn: () => aboutQuery.getBlobal({ locale: LOCALE }),
  });

  // Tracks scroll progress specifically while this section moves through
  // the viewport — 0 when it first appears near the bottom, 1 once it's
  // scrolled up near the top. Tune the offsets against the real feel later.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "start 0.25"],
  });

  const words =
    !isLoading && !error && data?.content
      ? getPlainTextFromRichText(data.content).split(" ")
      : [];

  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      <Container>
        <div className="max-w-5xl mx-auto text-center">
          {words.length > 0 && (
            <p className="text-2xl leading-[1.5] tracking-[-0.025em]">
              {words.map((word, i) => (
                <Word
                  key={i}
                  word={word}
                  index={i}
                  total={words.length}
                  progress={scrollYProgress}
                />
              ))}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}