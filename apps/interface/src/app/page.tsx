import { ArticleCard } from "@/components/card/ArticleCard";
import { TopCard } from "@/components/card/TopCard";
import { Button } from "@/components/ui/button";
import { ArticleResult } from "@/types/articleResult";
import Link from "next/link";

async function getArticles() {
  const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty");
  const data = await res.json();
  return data as number[];
}

export async function getArticle(id: string): Promise<
  | {
      success: true;
      by: string;
      descendants: number;
      id: number;
      kids: number[];
      score: number;
      time: number;
      title: string;
      type: string;
      url: string;
      ja: {
        title: string;
        description: string;
      };
      image: string;
    }
  | {
      success: false;
    }
> {
  let res: Response;
  try {
    res = await fetch(`${process.env.BACKEND_URL}/article/${id}`);

    const data = {
      success: true,
      ...(await res.json()),
    };

    return data;
  } catch {
    return {
      success: false,
    };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageNum = searchParams.page || 1;
  const validatedPageNum = typeof pageNum === "string" ? (parseInt(pageNum) > 25 ? 25 : parseInt(pageNum)) : 1;
  const articles = await getArticles();

  const splitArticles = articles.slice((validatedPageNum - 1) * 20, validatedPageNum * 20);

  const articleDataList: ArticleResult[] = [];

  for (const article of splitArticles) {
    const result = await getArticle(article.toString());
    articleDataList.push(result);
  }

  return (
    <>
      {validatedPageNum === 1 && (
        <>
          {articleDataList.length > 0 && articleDataList[0].success && <TopCard data={articleDataList[0]} />}

          {articleDataList.slice(1, 20).map((_articleData) => (
            <>{_articleData.success && <ArticleCard data={_articleData} />}</>
          ))}
        </>
      )}

      {validatedPageNum > 1 && (
        <>
          {articleDataList.map((_articleData) => (
            <>{_articleData.success && <ArticleCard data={_articleData} />}</>
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
