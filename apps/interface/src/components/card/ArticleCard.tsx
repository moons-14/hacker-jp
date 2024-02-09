import { convertUnixTimeToJSTDate } from "@/utils/convertUnixTimeToJSTDate";
import { formatRelative } from "date-fns";

export async function getArticle(id: string) {
  const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);

  const data = await res.json();

  return data as {
    by: string;
    descendants: number;
    id: number;
    kids: number[];
    score: number;
    time: number;
    title: string;
    type: string;
    url: string;
  };
}

export const ArticleCard = async ({
  id,
}: {
  id: string;
}) => {
  const article = await getArticle(id);

  if (article.id === 0) {
    return null;
  }

  return (
    <a href={article.url} target="_blank" rel="noreferrer">
      <div className="py-3">
        <div className="sm:flex gap-4 md:gap-8">
          <div className="w-full sm:w-[20%] min-w-[200px]">
            <img src={""} className="h-[110px] sm:h-[180px] w-full object-cover rounded" alt="article ogp" />
          </div>
          <div className="flex-1 py-2">
            <div className="text-xl md:text-2xl font-semibold line-clamp-2">{article.title}</div>
            <div className="text-right my-2">{formatRelative(convertUnixTimeToJSTDate(article.time), new Date())}</div>
            <div className="text-md md:text-lg line-clamp-4 md:line-clamp-3">{""}</div>
          </div>
        </div>
      </div>
    </a>
  );
};
