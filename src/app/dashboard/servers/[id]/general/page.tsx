"use client";

import { useParams } from "next/navigation";
import { useDiscordPack } from "~/contexts/DiscordPackContext";
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useState, useMemo, useCallback, memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { useUpdateServerSettings } from "~/hooks/use-server-settings";
import { ChannelType } from "discord-api-types/v10";
import { ChannelAutocomplete } from "../_components/channel-autocomplete";

interface Channel {
  id: string;
  name: string;
  type: number;
}

interface ChannelSelectorCardProps {
  title: string;
  description: string;
  channels: Channel[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  isVoice?: boolean;
}

const ChannelSelectorCard = memo(function ChannelSelectorCard({
  title,
  description,
  channels,
  value,
  onChange,
  placeholder,
  isVoice = false,
}: ChannelSelectorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChannelAutocomplete
          channels={channels}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          isVoice={isVoice}
        />
      </CardContent>
    </Card>
  );
});

interface WelcomeMessageCardProps {
  value: string;
  onChange: (value: string) => void;
}

const WelcomeMessageCard = memo(function WelcomeMessageCard({
  value,
  onChange,
}: WelcomeMessageCardProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Message</CardTitle>
        <CardDescription>
          Customize the welcome message. Use {"{user}"} for the member mention
          and {"{guild}"} for the server name.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Welcome to {guild}, {user}!"
          value={value}
          onChange={handleChange}
          className="max-w-lg"
        />
      </CardContent>
    </Card>
  );
});

export default function GeneralSettingsPage() {
  const params = useParams();
  const serverId = params.id as string;
  const pack = useDiscordPack();
  const guilds = pack?.transformedGuilds ?? [];
  const server = guilds.find((g) => g.id === serverId);

  const updateSettings = useUpdateServerSettings();

  // Form state
  const [logChannelId, setLogChannelId] = useState<string | null>(null);
  const [welcomeChannelId, setWelcomeChannelId] = useState<string | null>(null);
  const [voiceChannelId, setVoiceChannelId] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState("");

  // Memoize channel lists to prevent unnecessary recalculations
  const textChannels = useMemo(
    () =>
      server?.channels.filter(
        (c) =>
          c.type === ChannelType.GuildText ||
          c.type === ChannelType.GuildAnnouncement,
      ) ?? [],
    [server?.channels],
  );

  const voiceChannels = useMemo(
    () =>
      server?.channels.filter((c) => c.type === ChannelType.GuildVoice) ?? [],
    [server?.channels],
  );

  // Memoize callbacks to prevent child re-renders
  const handleLogChannelChange = useCallback(
    (value: string | null) => setLogChannelId(value),
    [],
  );

  const handleWelcomeChannelChange = useCallback(
    (value: string | null) => setWelcomeChannelId(value),
    [],
  );

  const handleVoiceChannelChange = useCallback(
    (value: string | null) => setVoiceChannelId(value),
    [],
  );

  const handleWelcomeMessageChange = useCallback(
    (value: string) => setWelcomeMessage(value),
    [],
  );

  const handleSave = useCallback(() => {
    if (!serverId) return;

    updateSettings.mutate({
      guildId: serverId,
      logChannelId,
      welcomeChannelId,
      voiceChannelId,
      welcomeMessage: welcomeMessage || undefined,
    });
  }, [
    serverId,
    logChannelId,
    welcomeChannelId,
    voiceChannelId,
    welcomeMessage,
    updateSettings,
  ]);

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
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back button */}
      <Link
        href={`/dashboard/servers/${serverId}`}
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
      >
        <IconArrowLeft className="size-4" />
        Back to {server.name}
      </Link>

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">General Settings</h1>
        <p className="text-muted-foreground">
          Configure general bot settings for {server.name}
        </p>
      </div>

      {/* Settings cards */}
      <div className="flex flex-col gap-4">
        <ChannelSelectorCard
          title="Log Channel"
          description="Select a channel where the bot will send log messages (member joins/leaves, message deletions, etc.)"
          channels={textChannels}
          value={logChannelId}
          onChange={handleLogChannelChange}
          placeholder="Search for a channel..."
        />

        <ChannelSelectorCard
          title="Welcome Channel"
          description="Select a channel where the bot will send welcome messages for new members."
          channels={textChannels}
          value={welcomeChannelId}
          onChange={handleWelcomeChannelChange}
          placeholder="Search for a channel..."
        />

        <WelcomeMessageCard
          value={welcomeMessage}
          onChange={handleWelcomeMessageChange}
        />

        <ChannelSelectorCard
          title="Voice Activity Channel"
          description="Select a voice channel to track voice activity for XP rewards."
          channels={voiceChannels}
          value={voiceChannelId}
          onChange={handleVoiceChannelChange}
          placeholder="Search for a channel..."
          isVoice
        />

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="w-32"
          >
            {updateSettings.isPending ? (
              <>
                <IconLoader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          {updateSettings.isSuccess && (
            <span className="text-sm text-green-600 dark:text-green-400">
              Settings saved successfully!
            </span>
          )}
          {updateSettings.isError && (
            <span className="text-sm text-red-600 dark:text-red-400">
              Failed to save settings. Please try again.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
