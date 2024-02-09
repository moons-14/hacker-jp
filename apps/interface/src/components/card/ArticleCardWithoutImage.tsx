import { getArticle } from "./ArticleCard";
import { formatRelative } from "date-fns";
import { convertUnixTimeToJSTDate } from "@/utils/convertUnixTimeToJSTDate";

export const ArticleCardWithoutImage = async ({
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
        <div className="">
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
