import { Skeleton } from "~/components/ui/skeleton";

export default function LeaderboardSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton
          key={index}
          className="container flex h-14 w-2xl items-center justify-between gap-3 truncate rounded-sm bg-zinc-100 p-3 hover:bg-zinc-200 sm:min-w-96 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        />
      ))}
    </>
  );
}
