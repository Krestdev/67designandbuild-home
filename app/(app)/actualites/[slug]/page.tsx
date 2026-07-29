"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { articleListQuery } from "@/hooks/article/articleListQuery";
import type { Article } from "@/hooks/article/type";
import { formatArticleDate } from "@/lib/formatArticleDate";
import { CtaBanner } from "@/components/CtaBanner";

const LOCALE = "fr"; // TODO: swap for useLocale() once the provider exists

function ArticleContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-[1280px] mx-auto px-4 md:px-6">{children}</div>;
}

function SimilarArticleCard({ article }: { article: Article }) {
  const imageUrl =
    article.image && typeof article.image === "object" ? article.image.url : null;

  if (!imageUrl) return null;

  return (
    <Link href={`/actualites/${article.slug ?? ""}`} className="block group">
      <div className="relative aspect-[16/9] overflow-hidden mb-3">
        <Image
          src={imageUrl}
          alt={article.title ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 340px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="font-semibold text-lg leading-[1.1] text-[#212121] mb-1">
        {article.title}
      </h3>
      <p className="text-sm text-[#6B7280]">
        {article.publishedDate && formatArticleDate(article.publishedDate)}
      </p>
    </Link>
  );
}

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const {
    data: articleMatches,
    isLoading: articleLoading,
    error: articleError,
  } = useQuery<Article[]>({
    queryKey: ["article", slug, LOCALE],
    queryFn: () =>
      articleListQuery.get({
        "where[slug][equals]": slug,
        depth: 2,
        locale: LOCALE,
      }),
  });

  const article = articleMatches?.[0];
  const categoryId =
    article?.category && typeof article.category === "object"
      ? article.category.id
      : article?.category;

  const {
    data: sameCategoryArticles,
    isLoading: similarLoading,
  } = useQuery<Article[]>({
    queryKey: ["similar-articles", categoryId, LOCALE],
    queryFn: () =>
      articleListQuery.get({
        "where[category][equals]": String(categoryId),
        depth: 2,
        locale: LOCALE,
        sort: "-publishedDate",
      }),
    enabled: !!categoryId,
  });

  if (articleLoading) return null;
  if (articleError || !article) return null;

  const heroImage =
    article.image && typeof article.image === "object" ? article.image.url : null;

  const similarArticles = (sameCategoryArticles ?? [])
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="relative min-h-[409.6px] flex items-center justify-center">
        {heroImage && (
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            className="object-cover -z-10"
          />
        )}
        <div className="absolute inset-0 bg-black/50 -z-10" />

        <ArticleContainer>
          <h1 className="font-semibold text-4xl md:text-[60px] leading-[1.1] tracking-[1.1px] text-white text-center max-w-[720px] mx-auto">
            {article.title}
          </h1>
        </ArticleContainer>
      </section>

      {/* ---- CONTENT + SIMILAR ARTICLES ---- */}
      <section className="bg-[#FBF6EE] py-16 md:py-[120px]">
        <ArticleContainer>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
            <div className="text-base leading-[1.5] text-[#212121] [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-6 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_img]:w-full [&_img]:h-auto [&_img]:object-cover [&_img]:aspect-[16/9] [&_img]:rounded-none [&_img]:my-8 [&_p+p]:mt-3">
              {article.content && <RichText data={article.content} />}
            </div>

            {similarArticles.length > 0 && (
              <div>
                <h2 className="font-bold text-2xl leading-[1.1] text-[#212121] mb-6">
                  Articles similaires
                </h2>
                <div className="flex flex-col gap-6 mb-6">
                  {similarArticles.map((a) => (
                    <SimilarArticleCard key={a.id} article={a} />
                  ))}
                </div>
                <Link
                  href="/actualites"
                  className="inline-flex items-center bg-[#212121] text-white px-4 py-2 text-sm font-medium"
                >
                  Voir plus
                </Link>
              </div>
            )}
          </div>
        </ArticleContainer>
      </section>

      <CtaBanner />
    </div>
  );
}