"use client";
import { ArticleCard } from "@/components/card/ArticleCard";
import { LoadingCard } from "@/components/card/LoadingCard";
import { TopCard } from "@/components/card/TopCard";
import { Button } from "@/components/ui/button";
import { ArticleResult } from "@/types/articleResult";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default async function Home() {
  const searchParams = useSearchParams();
  const pageNum = searchParams.get("page") || 1;
  const validatedPageNum = typeof pageNum === "string" ? (parseInt(pageNum) > 25 ? 25 : parseInt(pageNum)) : 1;

  const [articleList, setArticleList] = useState<number[]>([]);
  const [articleDataList, setArticleDataList] = useState<ArticleResult[]>([]);

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
      .then((res) => res.json())
      .then((data) => {
        setArticleList(data.slice((validatedPageNum - 1) * 20, validatedPageNum * 20));
      });
  }, [validatedPageNum]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const _articleDataList: ArticleResult[] = [];

    for (let i = 0; i < articleList.length; i++) {
      const articleId = articleList[i];
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/article/${articleId}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            _articleDataList[i] = { ...data, status: "success" } as ArticleResult;
          } else {
            _articleDataList[i] = { status: "error" };
          }
          setArticleDataList([..._articleDataList]);
        })
        .catch(() => {
          _articleDataList[i] = { status: "error" };
          setArticleDataList([..._articleDataList]);
        });
    }
  }, [articleList]);

  console.log(articleDataList);

  return (
    <>
      {validatedPageNum === 1 && (
        <>
          {articleDataList.length > 0 && articleDataList && articleDataList[0].status === "success" && <TopCard data={articleDataList[0]} />}

          {articleDataList.slice(1, 20).map((_articleData) => (
            <>{_articleData && _articleData.status === "success" && <ArticleCard data={_articleData} key={_articleData.id} />}</>
          ))}
        </>
      )}

      {validatedPageNum > 1 && (
        <>
          {articleDataList.map((_articleData) => (
            <>{_articleData && _articleData.status === "success" && <ArticleCard data={_articleData} key={_articleData.id} />}</>
          ))}
        </>
      )}

      {articleDataList.length < 20 && (
        <>
          {[...Array(20 - articleDataList.length)].map((_, _i) => (
            <LoadingCard
              key={`${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                _i
              }loading`}
            />
          ))}
        </>
      )}

      {validatedPageNum < 25 && (
        <div className="w-full flex justify-center mt-8">
          <Link href={`/?page=${validatedPageNum + 1}`}>
            <Button>次のページ</Button>
          </Link>
        </div>
      )}
    </>
  );
}
