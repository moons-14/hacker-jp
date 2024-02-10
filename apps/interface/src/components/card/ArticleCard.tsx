import { convertUnixTimeToJSTDate } from "@/utils/convertUnixTimeToJSTDate";
import { formatRelative } from "date-fns";
import { CustomImage } from "../CustomImage";
import Link from "next/link";

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
    res = await fetch(`http://localhost:8787/articles/${id}`);

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

export const ArticleCard = async ({
  id,
}: {
  id: string;
}) => {
  const article = await getArticle(id);

  if (article.success) {
    return (
      <div className="py-3">
        <div className="sm:flex gap-4 md:gap-8">
          <a className="w-full sm:w-[20%] min-w-[200px]" href={article.url} target="_blank" rel="noreferrer">
            <CustomImage src={article.image ? article.image : "/ogp.jpg"} className="h-[110px] sm:h-[180px] w-full object-cover rounded" alt="article ogp" />
          </a>
          <div className="flex-1 py-2">
            <a href={article.url} target="_blank" rel="noreferrer">
              <div className="text-xl md:text-2xl font-semibold line-clamp-2">{article.ja.title ? article.ja.title : article.title}</div>
              <div className="text-right my-2">{formatRelative(convertUnixTimeToJSTDate(article.time), new Date())}</div>
            </a>
            <Link href={`/article/${id}`} className="text-md md:text-lg line-clamp-4 md:line-clamp-3">
              {article.ja.description ? article.ja.description : "要約を取得できませんでした。"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
