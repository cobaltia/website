import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useDiscordPack } from "~/contexts/DiscordPackContext";
import { apiFetch, cn } from "~/lib/utils";
import { VcTimeLeaderboard } from "~/types/cobaltia";
import LeaderboardSkeleton from "./leaderboard-skeleton";
import { useInView } from "react-intersection-observer";

export default function VCTime() {
  const fetchVcTimeLeaderboard = async ({
    pageParam,
  }: {
    pageParam: number;
  }) => {
    const data = await apiFetch<VcTimeLeaderboard[]>(
      `/leaderboard?id=vctime&offset=${pageParam * 10}&limit=${10}`,
    );
    return data;
  };
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["leaderboard", "vctime"],
    queryFn: fetchVcTimeLeaderboard,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 10 ? pages.length : undefined,
  });
  const authenticated = useAuthenticated();
  const pack = useDiscordPack();
  const user = pack?.user;

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <>
      {status === "pending" ? (
        <>
          <div className="flex flex-col justify-center gap-3">
            <LeaderboardSkeleton />
          </div>
        </>
      ) : status === "error" || !data ? (
        <p>No Data</p>
      ) : (
        <>
          {data.pages.map((group, index) => (
            <React.Fragment key={index}>
              {group.map((data) => (
                <div
                  key={data.id}
                  className={cn(
                    "container flex max-w-2xl items-center justify-between gap-3 truncate rounded-sm p-3 sm:min-w-96",
                    authenticated && user?.id === data.id
                      ? "bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                      : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <p>{data.rank}</p>
                    <Avatar>
                      <AvatarImage src={data.avatar} alt="Avatar" />
                      <AvatarFallback>{data.tag}</AvatarFallback>
                    </Avatar>
                    <p>{data.tag}</p>
                  </div>
                  <p>{data.duration}</p>
                </div>
              ))}
            </React.Fragment>
          ))}
          {hasNextPage && (
            <>
              <div ref={loadMoreRef} />
              {isFetching && !isFetchingNextPage ? (
                <LeaderboardSkeleton />
              ) : null}
            </>
          )}
        </>
      )}
    </>
  );
}
