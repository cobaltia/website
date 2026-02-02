import { IconCrownFilled } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "~/lib/utils";
import type { OauthFlattenedGuild } from "~/types/apiData";

interface ServerCardProps {
  server: OauthFlattenedGuild;
  className?: string;
  userId?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getGuildIconURL(guild: OauthFlattenedGuild, size = 64): string | null {
  if (!guild.icon) return null;
  const format = guild.icon.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${format}?size=${size}`;
}

function getGuildBannerURL(
  guild: OauthFlattenedGuild,
  size = 300,
): string | null {
  // Try banner first, then splash as fallback
  if (guild.banner) {
    const format = guild.banner.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.${format}?size=${size}`;
  }
  if (guild.splash) {
    return `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=${size}`;
  }
  return null;
}

export function ServerCard({ server, className, userId }: ServerCardProps) {
  const iconURL = getGuildIconURL(server);
  const bannerURL = getGuildBannerURL(server);

  return (
    <Link
      href={`/dashboard/servers/${server.id}`}
      className={cn(
        "group border-border bg-card hover:border-primary/50 hover:bg-accent/50 relative flex flex-col overflow-hidden rounded-lg border transition-colors",
        className,
      )}
    >
      {/* Banner area */}
      <div className="bg-muted relative h-24 w-full overflow-hidden">
        {bannerURL ? (
          <Image
            src={bannerURL}
            alt=""
            width={480}
            height={96}
            className="h-full w-full object-cover object-top"
          />
        ) : null}
      </div>

      {/* Content area */}
      <div className="flex items-center gap-3 p-3">
        {/* Server icon */}
        <div className="bg-muted relative size-11 shrink-0 overflow-hidden rounded-full">
          {iconURL ? (
            <Image
              src={iconURL}
              alt={server.name}
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex size-full items-center justify-center text-base font-medium">
              {getInitials(server.name)}
            </div>
          )}
        </div>

        {/* Server info */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-foreground truncate font-medium">
              {server.name}
            </span>
            {server.ownerId === userId && (
              <IconCrownFilled className="size-4 shrink-0 text-yellow-500" />
            )}
          </div>
          <span className="text-muted-foreground text-sm">
            {(server.approximateMemberCount ?? 0).toLocaleString()}{" "}
            {server.approximateMemberCount === 1 ? "Member" : "Members"}
          </span>
        </div>
      </div>
    </Link>
  );
}
