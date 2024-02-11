import { LoadingCard } from "@/components/card/LoadingCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageNum = searchParams.page || 1;
  const validatedPageNum = typeof pageNum === "string" ? (parseInt(pageNum) > 25 ? 25 : parseInt(pageNum)) : 1;

  return (
    <>
      {[...Array(20)].map(() => (
        <LoadingCard />
      ))}

      {validatedPageNum < 25 && (
        <div className="w-full flex justify-center mt-8">
          <Link href={`/?page=${validatedPageNum + 1}`}>
            <Button>次のページ</Button>
          </Link>
        </div>
      )}
    </>
  );
}
