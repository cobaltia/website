import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { apiFetch } from "~/lib/utils";
import {
  LEADERBOARD_CONFIG,
  type LeaderboardEntry,
} from "~/lib/leaderboard-config";

export function useLeaderboard(category: string) {
  const config = LEADERBOARD_CONFIG.find((c) => c.value === category);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["leaderboard", config?.apiId],
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        return apiFetch<LeaderboardEntry[]>(
          `/leaderboard?id=${config!.apiId}&offset=${pageParam * 10}&limit=10`,
        );
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 10 ? pages.length : undefined,
      enabled: !!config,
    });

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  const allEntries = data?.pages.flat() ?? [];

  return {
    entries: allEntries,
    loadMoreRef,
    status,
    hasNextPage,
    isFetchingNextPage,
    config,
  };
}
