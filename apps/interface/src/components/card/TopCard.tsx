import { getArticle } from "./ArticleCard";
import { formatRelative } from "date-fns";
import { convertUnixTimeToJSTDate } from "@/utils/convertUnixTimeToJSTDate";

export const TopCard = async ({
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
      <div className="py-6">
        <div className="sm:flex gap-4 md:gap-8">
          <div className="w-full sm:w-[40%]">
            <img src={article.image ? article.image : "/ogp.jpg"} className="h-[240px] md:h-[320px] w-full object-cover rounded" alt="article ogp" />
          </div>
          <div className="flex-1 py-2">
            <div className="text-2xl md:text-3xl font-semibold line-clamp-2">{article.ja.title ? article.ja.title : article.title}</div>
            <div className="text-right my-2">{formatRelative(convertUnixTimeToJSTDate(article.time), new Date())}</div>
            <div className="text-lg md:text-xl line-clamp-4">{article.ja.description ? article.ja.description : "要約を取得できませんでした。"}</div>
          </div>
        </div>
      </div>
    </a>
  );
};
