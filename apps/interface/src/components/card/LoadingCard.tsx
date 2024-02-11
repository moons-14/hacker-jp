export const LoadingCard = () => {
  return (
    <div className="p-4 h-[200px]">
      <div className="animate-pulse space-y-4">
        <div className="rounded bg-gray-200 dark:bg-gray-900 h-[100px] w-full" />
        <div className="flex space-x-4">
          <div className="rounded-md bg-gray-200 dark:bg-gray-900 h-4 w-1/12" />
          <div className="rounded-md bg-gray-200 dark:bg-gray-900 h-4 w-1/12" />
          <div className="rounded-md bg-gray-200 dark:bg-gray-900 h-4 w-1/12" />
        </div>
      </div>
    </div>
  );
};
