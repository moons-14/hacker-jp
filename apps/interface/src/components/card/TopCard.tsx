export const TopCard = ({
  title,
  imageUrl,
  url,
  description,
  createdAt,
}: { title: string; imageUrl: string; url: string; description: string; createdAt: string }) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div className="py-6">
        <div className="sm:flex gap-4 md:gap-8">
          <div className="w-full sm:w-[40%]">
            <img src={imageUrl} className="h-[240px] md:h-[320px] w-full object-cover rounded" alt="article ogp" />
          </div>
          <div className="flex-1 py-2">
            <div className="text-2xl md:text-3xl font-semibold line-clamp-2">{title}</div>
            <div className="text-right my-2">{createdAt}</div>
            <div className="text-lg md:text-xl line-clamp-4">{description}</div>
          </div>
        </div>
      </div>
    </a>
  );
};
