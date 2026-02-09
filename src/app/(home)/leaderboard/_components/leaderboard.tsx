import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useDiscordPack } from "~/contexts/DiscordPackContext";
import { useLeaderboard } from "~/hooks/use-leaderboard";
import { cn } from "~/lib/utils";
import LeaderboardSkeleton from "./leaderboard-skeleton";

interface LeaderboardProps {
  category: string;
}

export default function Leaderboard({ category }: LeaderboardProps) {
  const {
    entries,
    loadMoreRef,
    status,
    hasNextPage,
    isFetchingNextPage,
    config,
  } = useLeaderboard(category);
  const authenticated = useAuthenticated();
  const pack = useDiscordPack();
  const user = pack?.user;

  if (!config) return <p>Invalid category</p>;

  if (status === "pending") return <LeaderboardSkeleton />;
  if (status === "error" || entries.length === 0) return <p>No Data</p>;

  return (
    <>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={cn(
            "container flex max-w-2xl items-center justify-between gap-3 truncate rounded-sm p-3 sm:min-w-96",
            authenticated && user?.id === entry.id
              ? "bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
              : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800",
          )}
        >
          <div className="flex items-center gap-3">
            <p>{entry.rank}</p>
            <Avatar>
              <AvatarImage src={entry.avatar} alt="Avatar" />
              <AvatarFallback>{entry.tag}</AvatarFallback>
            </Avatar>
            <p>{entry.tag}</p>
          </div>
          <p>{config.formatValue(entry)}</p>
        </div>
      ))}
      {hasNextPage && (
        <>
          {isFetchingNextPage ? <LeaderboardSkeleton /> : null}
          <div ref={loadMoreRef} />
        </>
      )}
    </>
  );
}
