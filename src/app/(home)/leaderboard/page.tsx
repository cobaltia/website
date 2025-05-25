"use client";
import { useTRPC } from "~/trpc/react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn, displayAvatarURL } from "~/lib/utils";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const api = useTRPC();
  const [value, setValue] = useState("wallet");
  const { isSignedIn, user: clerkUser, isLoaded } = useUser();
  const {
    isLoading,
    isError,
    data: users,
  } = useQuery(api.leaderboard.getGlobalNetworth.queryOptions({}));

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 pb-3">
        <h1>Leaderboard</h1>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="wallet">Wallet</SelectItem>
            <SelectItem value="bank">Bank</SelectItem>
            <SelectItem value="net_worth">Net Worth</SelectItem>
            <SelectItem value="level">Level</SelectItem>
            <SelectItem value="social_credit">Social Credit</SelectItem>
            <SelectItem value="vc_time">VC Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-center justify-center">
        {isLoading || !isLoaded ? (
          <>
            <div className="flex flex-col justify-center gap-3">
              {Array.from({ length: 20 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="container flex h-14 w-72 items-center justify-between gap-3 truncate rounded-sm bg-zinc-100 p-3 hover:bg-zinc-200 sm:min-w-96 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                />
              ))}
            </div>
          </>
        ) : isError || !users ? (
          <p>No Data</p>
        ) : (
          <div className="flex flex-col justify-center gap-3">
            {users.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "container flex items-center justify-between gap-3 truncate rounded-sm p-3 sm:min-w-96",
                  isSignedIn &&
                    clerkUser.externalAccounts[0]?.providerUserId === user.id
                    ? "bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                    : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800",
                )}
              >
                <div className="flex items-center gap-3">
                  <p>
                    {users.findIndex((userMap) => userMap.id === user.id) + 1}
                  </p>
                  <Avatar>
                    <AvatarImage
                      src={displayAvatarURL(
                        user.avatar,
                        user.id,
                        user.discriminator ?? "0",
                      )}
                      alt="Avatar"
                    />
                    <AvatarFallback>{user.displayName}</AvatarFallback>
                  </Avatar>
                  <p>{user.displayName}</p>
                </div>
                <p>{user.networth}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
