"use client";

import { useDiscordPack } from "~/contexts/DiscordPackContext";
import { ServerCard } from "./_components/server-card";
import { useAuthenticated } from "~/contexts/AuthenticationContext";

export default function Page() {
  const authenticated = useAuthenticated();
  const pack = useDiscordPack();
  const user = pack?.user;
  const guilds = (pack?.transformedGuilds ?? []).filter(
    (guild) => guild.manageable,
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {!authenticated ? (
        <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
          <p>No servers found.</p>
          <p className="text-sm">
            Make sure you&apos;re logged in and have access to servers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {guilds.map((server) => (
            <ServerCard key={server.id} server={server} userId={user?.id} />
          ))}
        </div>
      )}
    </div>
  );
}
