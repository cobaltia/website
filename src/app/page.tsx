import Link from "next/link";
import { Button } from "~/components/ui/button";

import { api, HydrateClient } from "~/trpc/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();

  return (
    <HydrateClient>
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-9">
          <h1 className="text-5xl text-zinc-950 dark:text-white">
            Cobalt Network
          </h1>
          <div className="flex flex-row items-center gap-3">
            <SignedOut>
              <Button asChild className="cursor-pointer">
                <SignInButton />
              </Button>
            </SignedOut>
            <SignedIn>
              {user && <div>Hello {user.username}</div>}
              <Button asChild className="cursor-pointer">
                <SignOutButton />
              </Button>
            </SignedIn>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
