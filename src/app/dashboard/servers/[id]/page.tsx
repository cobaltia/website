"use client";

import { useParams } from "next/navigation";
import { useDiscordPack } from "~/contexts/DiscordPackContext";
import {
  IconArrowLeft,
  IconSettings,
  IconBell,
  IconShield,
  IconMusic,
  IconMessageCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

function getGuildIconURL(
  guildId: string,
  icon: string | null,
  size = 128,
): string | null {
  if (!icon) return null;
  const format = icon.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.${format}?size=${size}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const settingsSections = [
  {
    title: "General",
    description: "Configure general bot settings for this server",
    icon: IconSettings,
    href: "general",
  },
];

export default function ServerSettingsPage() {
  const params = useParams();
  const serverId = params.id as string;
  const pack = useDiscordPack();
  const guilds = pack?.transformedGuilds ?? [];
  const server = guilds.find((g) => g.id === serverId);

  if (!server) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Link
          href="/dashboard/servers"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <IconArrowLeft className="size-4" />
          Back to servers
        </Link>
        <div className="text-muted-foreground flex flex-col items-center justify-center py-12">
          <p>Server not found.</p>
          <p className="text-sm">Make sure you have access to this server.</p>
        </div>
      </div>
    );
  }

  const iconURL = getGuildIconURL(server.id, server.icon);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back button */}
      <Link
        href="/dashboard/servers"
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
      >
        <IconArrowLeft className="size-4" />
        Back to servers
      </Link>

      {/* Server header */}
      <div className="flex items-center gap-4">
        <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-full">
          {iconURL ? (
            <Image
              src={iconURL}
              alt={server.name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex size-full items-center justify-center text-xl font-medium">
              {getInitials(server.name)}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{server.name}</h1>
          <p className="text-muted-foreground">
            {(server.approximateMemberCount ?? 0).toLocaleString()} members
          </p>
        </div>
      </div>

      {/* Settings sections */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section) => (
          <Link
            key={section.href}
            href={`/dashboard/servers/${serverId}/${section.href}`}
          >
            <Card className="hover:border-primary/50 hover:bg-accent/50 h-full transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                    <section.icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
