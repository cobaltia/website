import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { cn, displayAvatarURL } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export default function Wallet() {
  const api = useTRPC();
  const { isSignedIn, user: clerkUser, isLoaded } = useUser();
  const {
    isLoading,
    isError,
    data: users,
  } = useQuery(api.leaderboard.getGlobalUserWallet.queryOptions({}));

  return (
    <>
      {isLoading || !isLoaded ? (
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
      ) : isError || !users ? (
        <p>No Data</p>
      ) : (
        <>
          {users.map((user, index) => (
            <div
              key={user.id}
              className={cn(
                "container flex max-w-2xl items-center justify-between gap-3 truncate rounded-sm p-3 sm:min-w-96",
                isSignedIn &&
                  clerkUser.externalAccounts[0]?.providerUserId === user.id
                  ? "bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                  : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800",
              )}
            >
              <div className="flex items-center gap-3">
                <p>{index + 1}</p>
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
              <p>{user.wallet}</p>
            </div>
          ))}
        </>
      )}
    </>
  );
}
