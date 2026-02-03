"use client";

import { useParams } from "next/navigation";
import { useDiscordPack } from "~/contexts/DiscordPackContext";
import { useAuthenticated } from "~/contexts/AuthenticationContext";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function Page() {
  const params = useParams<{ id: string }>();
  const authenticated = useAuthenticated();
  const pack = useDiscordPack();
  const user = pack?.user;

  const server = pack.transformedGuilds?.find((g) => g.id === params.id);

  if (!authenticated) return <div>Please log in to view this server.</div>;

  if (!server) return <div>Server not found.</div>;

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 pt-3 sm:pb-3">
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          {server.name}
        </h1>
      </div>
      <div className="mt-4 mr-3 ml-3 sm:mt-0 sm:mr-4 sm:ml-4 sm:flex sm:gap-4">
        <Card className="w-full sm:w-1/2">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your server settings</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full"
              nativeButton={false}
              render={
                <Link href={`/dashboard/servers/${params.id}/settings`}>
                  View Settings
                </Link>
              }
            />
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
