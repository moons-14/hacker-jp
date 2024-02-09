export const ArticleCard = ({
  title,
  imageUrl,
  url,
  description,
  createdAt,
}: {
  title: string;
  imageUrl: string;
  url: string;
  description: string;
  createdAt: string;
}) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div className="py-3">
        <div className="sm:flex gap-4 md:gap-8">
          <div className="w-full sm:w-[20%] min-w-[200px]">
            <img src={imageUrl} className="h-[110px] sm:h-[180px] w-full object-cover rounded" alt="article ogp" />
          </div>
          <div className="flex-1 py-2">
            <div className="text-xl md:text-2xl font-semibold line-clamp-2">{title}</div>
            <div className="text-right my-2">{createdAt}</div>
            <div className="text-md md:text-lg line-clamp-4 md:line-clamp-3">{description}</div>
          </div>
        </div>
      </div>
    </a>
  );
};
