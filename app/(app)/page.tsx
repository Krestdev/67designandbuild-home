"use client";
import JsonViewer from "@/components/dev/JsonViewer";
import FetchError from "@/components/errors";
import { homeQuery } from "@/hooks/home/homeQuery";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: () => homeQuery.get({ depth: 2, locale: "fr" }),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        Loading...
      </div>
    );
  }

  if (error) {
    return <FetchError error={error} />;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center gap-4 py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/logo67.svg"
          alt="67design logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          <h1 className="max-w-md text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Follow the instructions to get started
          </h1>

          <div>
            <h2 className="max-w-md text-2xl font-medium leading-10 tracking-tight text-black dark:text-zinc-50">
              Scoop Document
            </h2>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              To begin with, take a look at the{" "}
              <a
                href="https://app.clickup.com/9015899775/v/dc/8cp7dkz-4935/8cp7dkz-2415"
                className="font-medium text-zinc-950 dark:text-zinc-50"
              >
                scoop document
              </a>{" "}
              file.
            </p>
          </div>

          <div>
            <h2 className="max-w-md text-2xl font-medium leading-10 tracking-tight text-black dark:text-zinc-50">
              Design Overview
            </h2>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              To follow up, go through the{" "}
              <a
                href="https://www.figma.com/design/EUA51YEj3npzvLUjWKGjjV/67-Design-And-Build?node-id=0-1&p=f&t=LOsot6LfUa7ahF1r-0"
                className="font-medium text-zinc-950 dark:text-zinc-50"
              >
                figma design
              </a>{" "}
              file.
            </p>
          </div>

          <div>
            <h2 className="max-w-md text-2xl font-medium leading-10 tracking-tight text-black dark:text-zinc-50">
              To get started, edit the page.tsx file.
            </h2>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Looking for a starting point or more instructions? Head over to
              the{" "}
              <a
                href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                className="font-medium text-zinc-950 dark:text-zinc-50"
              >
                Learning
              </a>{" "}
              center.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>

        {data && (
          <div className="flex flex-col m-4 gap-4 text-base font-medium sm:flex-row">
            <JsonViewer json={data} />
          </div>
        )}
        {[
          {
            name: "about",
            link: "/about",
          },
          {
            name: "blog",
            link: "/blog",
          },
          {
            name: "career",
            link: "/career",
          },
          {
            name: "faq",
            link: "/faq",
          },
          {
            name: "sector",
            link: "/sector",
          },
          {
            name: "service",
            link: "/service",
          },
        ].map((item) => (
          <Link key={item.name} href={item.link}>
            {item.name}
          </Link>
        ))}
      </main>
    </div>
  );
}
