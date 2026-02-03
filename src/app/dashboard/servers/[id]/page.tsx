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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { IconRobot } from "@tabler/icons-react";
import { CLIENT_ID } from "~/lib/constants";

export default function Page() {
  const params = useParams<{ id: string }>();
  const authenticated = useAuthenticated();
  const pack = useDiscordPack();
  const user = pack?.user;

  const server = pack.transformedGuilds?.find((g) => g.id === params.id);

  if (!authenticated) return <div>Please log in to view this server.</div>;

  if (!server) return <div>Server not found.</div>;

  if (!server.cobaltiaIsIn) {
    const botInviteUrl = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot&permissions=8&guild_id=${params.id}`;
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconRobot />
            </EmptyMedia>
            <EmptyTitle>Cobaltia is not in this server</EmptyTitle>
            <EmptyDescription>
              Add Cobaltia to {server.name} to configure settings.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button render={<a href={botInviteUrl} target="_blank" />}>
              Add Cobaltia
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

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
