"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { actualitesGlobalQuery } from "@/hooks/article/actualitesGlobalQuery";
import { articleListQuery } from "@/hooks/article/articleListQuery";
import { categoryListQuery } from "@/hooks/article/categoryListQuery";
import type { ActualitesGlobal, Article, Category } from "@/hooks/article/type";
import { formatArticleDate } from "@/lib/formatArticleDate";
import { CtaBanner } from "@/components/CtaBanner";
import { useLocale } from "@/providers/localeProvider";

function ActualitesContainer({ children }: { children: React.ReactNode }) {
  return <div className="max-w-7xl mx-auto px-6">{children}</div>;
}

function ArticleCard({
  article,
  aspect = "aspect-[16/9]",
}: {
  article: Article;
  aspect?: string;
}) {
  const imageUrl =
    article.image && typeof article.image === "object" ? article.image.url : null;

  if (!imageUrl) return null;

  return (
    <Link href={`/actualites/${article.slug ?? ""}`} className="block group">
      <div className={`relative ${aspect} overflow-hidden mb-4`}>
        <Image
          src={imageUrl}
          alt={article.title ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-[20px] lg:text-[24px] font-medium leading-tight text-[#212121] mb-2">
  {article.title}
</h3>
      <p className="text-sm text-[#5B5B5B]">
        {article.publishedDate && formatArticleDate(article.publishedDate)}
      </p>
    </Link>
  );
}

export default function ActualitesPage() {
  const { locale, t } = useLocale();

  const { data: intro, isLoading: introLoading, error: introError } = useQuery<ActualitesGlobal>({
    queryKey: ["actualites-global", locale],
    queryFn: () => actualitesGlobalQuery.getBlobal({ locale }),
  });

  const { data: articles, isLoading: articlesLoading, error: articlesError } = useQuery<Article[]>({
    queryKey: ["articles", locale],
    queryFn: () =>
      articleListQuery.get({ depth: 2, locale, sort: "-publishedDate" }),
  });

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery<Category[]>({
    queryKey: ["categories", locale],
    queryFn: () => categoryListQuery.get({ locale }),
  });

  if (introLoading || articlesLoading || categoriesLoading) return null;
  if (introError || articlesError || categoriesError || !intro) return null;

  const allArticles = articles ?? [];
  const featured = allArticles.filter((a) => a.featured).slice(0, 3);
  const latest = allArticles.slice(0, 3);

  const heroImage =
    intro.heroImage && typeof intro.heroImage === "object"
      ? intro.heroImage.url
      : null;

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

        <ActualitesContainer>
          <div className="flex flex-col gap-3 items-center text-center max-w-[720px] mx-auto">
            <h1 className="font-semibold text-4xl md:text-[60px] leading-[1.1] tracking-[-0.025em] text-white">
              {intro.heroTitle}
            </h1>
            <p className="text-base leading-[1.5] text-[#EBEBEB]">
              {intro.heroSubtitle}
            </p>
          </div>
        </ActualitesContainer>
      </section>

      <section className="bg-[#FBF3EA] py-16 md:py-[120px]">
        <ActualitesContainer>
          {/* ---- EN VEDETTE ---- */}
          {featured.length > 0 && (
            <div className="mb-16">
              <h2 className="font-semibold text-[28px] md:text-[48px] leading-[1.1] tracking-[-0.025em] text-[#212121] mb-6">
                {t("featured")}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                {featured[0] && (
                  <ArticleCard article={featured[0]} aspect="aspect-[4/3]" />
                )}
               <div className="flex flex-col gap-6">
                  {featured.slice(1, 3).map((article) => (
                    <ArticleCard key={article.id} article={article} aspect="aspect-[16/9]" />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---- DERNIERS ARTICLES ---- */}
          {latest.length > 0 && (
            <div className="mb-16">
              <h2 className="font-semibold text-[28px] md:text-[48px] leading-[1.1] tracking-[-0.025em] text-[#212121] mb-6">
                {t("latestArticles")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* ---- PER-CATEGORY SECTIONS ---- */}
          {categories?.map((cat) => {
            const catArticles = allArticles.filter((a) => {
              const catId = typeof a.category === "object" ? a.category?.id : a.category;
              return catId === cat.id;
            });

            if (catArticles.length === 0) return null;

            return (
              <div key={cat.id} className="mb-16">
                <h2 className="font-semibold text-[28px] md:text-[48px] leading-[1.1] tracking-[-0.025em] text-[#212121] mb-6">
                  {cat.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {catArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            );
          })}
        </ActualitesContainer>
      </section>

      <CtaBanner />
    </div>
  );
}