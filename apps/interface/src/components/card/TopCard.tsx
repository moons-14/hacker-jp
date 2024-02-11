import { formatRelative } from "date-fns";
import { convertUnixTimeToJSTDate } from "@/utils/convertUnixTimeToJSTDate";
import { CustomImage } from "../CustomImage";
import { ArticleSuccessResult } from "@/types/articleResult";

export const TopCard = ({
  data,
}: {
  data: ArticleSuccessResult;
}) => {
  return (
    <a href={data.url} target="_blank" rel="noreferrer">
      <div className="py-6">
        <div className="sm:flex gap-4 md:gap-8">
          <div className="w-full sm:w-[40%]">
            <CustomImage src={data.image ? data.image : "/ogp.jpg"} className="h-[240px] md:h-[320px] w-full object-cover rounded" alt="article ogp" />
          </div>
          <div className="flex-1 py-2">
            <div className="text-2xl md:text-3xl font-semibold line-clamp-2">{data.ja.title ? data.ja.title : data.title}</div>
            <div className="text-right my-2">{formatRelative(convertUnixTimeToJSTDate(data.time), new Date())}</div>
            <div className="text-lg md:text-xl line-clamp-4">{data.ja.description ? data.ja.description : "要約を取得できませんでした。"}</div>
          </div>
        </div>
      </div>
    </a>
  );
};
