export const ArticleCardWithoutImage = ({
  title,
  url,
  description,
  createdAt,
}: {
  title: string;
  url: string;
  description: string;
  createdAt: string;
}) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div className="py-3">
        <div className="">
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
