import { ArticleCard } from "@/components/card/ArticleCard";
import { ArticleCardWithoutImage } from "@/components/card/ArticleCardWithoutImage";
import { LoadingCard } from "@/components/card/LoadingCard";
import { TopCard } from "@/components/card/TopCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

async function getArticles() {
  const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty");
  const data = await res.json();
  return data as number[];
}
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageNum = searchParams.page || 1;
  const validatedPageNum = typeof pageNum === "string" ? (parseInt(pageNum) > 10 ? 10 : parseInt(pageNum)) : 1;
  const articles = await getArticles();

  const splitArticles = articles.slice((validatedPageNum - 1) * 50, validatedPageNum * 50);

  return (
    <>
      {validatedPageNum === 1 && (
        <>
          <LoadingCard>
            <TopCard id={splitArticles[0].toString()} />
          </LoadingCard>

          {splitArticles.slice(1, 20).map((articleId) => (
            <LoadingCard>
              <ArticleCard id={articleId.toString()} />
            </LoadingCard>
          ))}

          {splitArticles.slice(20, 50).map((articleId) => (
            <LoadingCard>
              <ArticleCardWithoutImage id={articleId.toString()} />
            </LoadingCard>
          ))}
        </>
      )}

      {validatedPageNum > 1 && (
        <>
          {splitArticles.map((articleId) => (
            <LoadingCard>
              <ArticleCardWithoutImage id={articleId.toString()} />
            </LoadingCard>
          ))}
        </>
      )}

      {validatedPageNum < 10 && (
        <div className="w-full flex justify-center mt-8">
          <Link href={`/?page=${validatedPageNum + 1}`}>
            <Button>次のページ</Button>
          </Link>
        </div>
      )}
    </>
  );
}
