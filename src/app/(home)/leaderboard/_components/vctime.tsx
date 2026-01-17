import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useDiscordPack } from "~/contexts/DiscordPackContext";
import { apiFetch, cn } from "~/lib/utils";
import { VcTimeLeaderboard } from "~/types/cobaltia";

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

  return (
    <>
      {status === "pending" ? (
        <>
          <div className="flex flex-col justify-center gap-3">
            {Array.from({ length: 20 }).map((_, index) => (
              <Skeleton
                key={index}
                className="container flex h-14 w-2xl items-center justify-between gap-3 truncate rounded-sm bg-zinc-100 p-3 hover:bg-zinc-200 sm:min-w-96 dark:bg-zinc-900 dark:hover:bg-zinc-800"
              />
            ))}
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
          <div>
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetching}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                  ? "Load More"
                  : "No more data"}
            </Button>
          </div>
          <div>{isFetching && !isFetchingNextPage ? "fetching..." : null}</div>
        </>
      )}
    </>
  );
}
