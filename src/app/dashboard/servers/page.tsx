"use client";

import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useDiscordPack } from "~/contexts/DiscordPackContext";
import { ServerCard } from "./_components/server-card";

export default function Page() {
  const authenticated = useAuthenticated();
  const pack = useDiscordPack();
  const user = pack?.user;
  const guilds = (pack.transformedGuilds ?? []).filter(
    (guild) => guild.manageable,
  );

  if (!authenticated || !user) {
    return (
      <div>
        <h1>Please log in to view your servers.</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {guilds.map((server) => (
          <ServerCard key={server.id} server={server} user={user} />
        ))}
      </div>
    </div>
  );
}
