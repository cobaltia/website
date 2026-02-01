"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { IconMedal, IconMedal2, IconCrown } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useDiscordPack } from "~/contexts/DiscordPackContext";
import { apiFetch, cn } from "~/lib/utils";

interface LeaderboardEntry {
  id: string;
  avatar: string;
  tag: string;
  rank: number;
}

interface LeaderboardListProps<T extends LeaderboardEntry> {
  queryKey: string;
  endpoint: string;
  getValue: (entry: T) => string | number;
}

function PodiumCard({
  entry,
  position,
  getValue,
  isCurrentUser,
}: {
  entry: LeaderboardEntry & { value: string | number };
  position: 1 | 2 | 3;
  getValue: string | number;
  isCurrentUser: boolean;
}) {
  const positionConfig = {
    1: {
      icon: <IconCrown className="size-6 text-yellow-500" />,
      gradient: "from-yellow-500/20 to-yellow-600/5",
      border: "border-yellow-500/30",
      size: "h-32",
      order: "order-2",
      mt: "mt-0",
    },
    2: {
      icon: <IconMedal className="size-5 text-gray-400" />,
      gradient: "from-gray-400/20 to-gray-500/5",
      border: "border-gray-400/30",
      size: "h-28",
      order: "order-1",
      mt: "mt-4",
    },
    3: {
      icon: <IconMedal2 className="size-5 text-amber-700" />,
      gradient: "from-amber-700/20 to-amber-800/5",
      border: "border-amber-700/30",
      size: "h-28",
      order: "order-3",
      mt: "mt-4",
    },
  };

  const config = positionConfig[position];

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center",
        config.order,
        config.mt,
      )}
    >
      <Card
        className={cn(
          "w-full border bg-linear-to-b transition-all hover:scale-105",
          config.gradient,
          config.border,
          isCurrentUser && "ring-primary ring-2",
        )}
      >
        <CardContent
          className={cn(
            "flex flex-col items-center justify-center gap-2 p-4",
            config.size,
          )}
        >
          <div className="relative">
            <Avatar className={cn(position === 1 ? "size-14" : "size-12")}>
              <AvatarImage src={entry.avatar} alt={entry.tag} />
              <AvatarFallback>
                {entry.tag.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="bg-background absolute -top-1 -right-1 rounded-full p-0.5">
              {config.icon}
            </div>
          </div>
          <div className="text-center">
            <p
              className={cn(
                "max-w-24 truncate font-semibold",
                position === 1 ? "text-sm" : "text-xs",
              )}
            >
              {entry.tag}
            </p>
            <p
              className={cn(
                "font-bold",
                position === 1 ? "text-lg" : "text-base",
              )}
            >
              {getValue}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LeaderboardRow({
  entry,
  getValue,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  getValue: string | number;
  isCurrentUser: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-lg border p-3 transition-colors",
        isCurrentUser
          ? "bg-primary/10 border-primary/30"
          : "bg-card hover:bg-muted/50 border-border",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-8 text-center text-sm font-medium">
          {entry.rank}
        </span>
        <Avatar className="size-10">
          <AvatarImage src={entry.avatar} alt={entry.tag} />
          <AvatarFallback>{entry.tag.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="max-w-48 truncate font-medium">{entry.tag}</span>
      </div>
      <span className="font-semibold tabular-nums">{getValue}</span>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton key={index} className="h-14 w-full rounded-lg" />
      ))}
    </div>
  );
}

function PodiumSkeleton() {
  return (
    <div className="mb-8 flex items-end justify-center gap-4">
      <div className="order-1 mt-4 flex-1">
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
      <div className="order-2 flex-1">
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
      <div className="order-3 mt-4 flex-1">
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function LeaderboardList<T extends LeaderboardEntry>({
  queryKey,
  endpoint,
  getValue,
}: LeaderboardListProps<T>) {
  const authenticated = useAuthenticated();
  const pack = useDiscordPack();
  const currentUserId = pack?.user?.id;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["leaderboard", queryKey],
      queryFn: async ({ pageParam }: { pageParam: number }) => {
        const data = await apiFetch<T[]>(
          `${endpoint}&offset=${pageParam * 10}&limit=10`,
        );
        return data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 10 ? pages.length : undefined,
    });

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (status === "pending") {
    return (
      <div className="w-full max-w-2xl">
        <PodiumSkeleton />
        <LeaderboardSkeleton />
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <Card className="max-w-md">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Failed to load leaderboard. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const allEntries = data.pages.flat();
  const topThree = allEntries.slice(0, 3);
  const rest = allEntries.slice(3);

  return (
    <div className="w-full max-w-2xl">
      {/* Podium for top 3 */}
      {topThree.length >= 3 && topThree[0] && topThree[1] && topThree[2] && (
        <div className="mb-8 flex items-end justify-center gap-3 px-4">
          <PodiumCard
            key={topThree[1].id}
            entry={{ ...topThree[1], value: getValue(topThree[1]) }}
            position={2}
            getValue={getValue(topThree[1])}
            isCurrentUser={authenticated && currentUserId === topThree[1].id}
          />
          <PodiumCard
            key={topThree[0].id}
            entry={{ ...topThree[0], value: getValue(topThree[0]) }}
            position={1}
            getValue={getValue(topThree[0])}
            isCurrentUser={authenticated && currentUserId === topThree[0].id}
          />
          <PodiumCard
            key={topThree[2].id}
            entry={{ ...topThree[2], value: getValue(topThree[2]) }}
            position={3}
            getValue={getValue(topThree[2])}
            isCurrentUser={authenticated && currentUserId === topThree[2].id}
          />
        </div>
      )}

      {/* Rest of the leaderboard */}
      <div className="space-y-2">
        {rest.map((entry) => (
          <LeaderboardRow
            key={entry.id}
            entry={entry}
            getValue={getValue(entry)}
            isCurrentUser={authenticated && currentUserId === entry.id}
          />
        ))}
      </div>

      {/* Load more */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          {isFetchingNextPage && <Spinner className="size-6" />}
        </div>
      )}

      {/* End of list */}
      {!hasNextPage && allEntries.length > 0 && (
        <p className="text-muted-foreground py-4 text-center text-sm">
          You&apos;ve reached the end of the leaderboard
        </p>
      )}
    </div>
  );
}
