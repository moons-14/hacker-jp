import { convertUnixTimeToJSTDate } from "@/utils/convertUnixTimeToJSTDate";
import { formatRelative } from "date-fns";
import { CustomImage } from "../CustomImage";
import { ArticleSuccessResult } from "@/types/articleResult";

export const ArticleCard = ({
  data,
}: {
  data: ArticleSuccessResult;
}) => {
  return (
    <a href={data.url} target="_blank" rel="noreferrer">
      <div className="py-3">
        <div className="sm:flex gap-4 md:gap-8">
          <div className="w-full sm:w-[20%] min-w-[200px]">
            <CustomImage src={data.image ? data.image : "/ogp.jpg"} className="h-[110px] sm:h-[180px] w-full object-cover rounded" alt="article ogp" />
          </div>
          <div className="flex-1 py-2">
            <div className="text-xl md:text-2xl font-semibold line-clamp-2">{data.ja.title ? data.ja.title : data.title}</div>
            <div className="text-right my-2">{formatRelative(convertUnixTimeToJSTDate(data.time), new Date())}</div>
            <div className="text-md md:text-lg line-clamp-4 md:line-clamp-3">{data.ja.description ? data.ja.description : "要約を取得できませんでした。"}</div>
          </div>
        </div>
      </div>
    </a>
  );
};
