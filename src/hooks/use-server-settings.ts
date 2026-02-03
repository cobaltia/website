import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "~/lib/utils";
import { FetchMethods } from "~/lib/constants";

export interface ServerSettings {
  logChannelId: string | null;
  welcomeChannelId: string | null;
  voiceChannelId: string | null;
  welcomeMessage: string | null;
}

export interface ServerSettingsPayload {
  logChannelId?: string | null;
  welcomeChannelId?: string | null;
  voiceChannelId?: string | null;
  welcomeMessage?: string;
}

async function fetchServerSettings(guildId: string) {
  return apiFetch<ServerSettings>(`/guild/${guildId}/settings`);
}

async function updateServerSettings({
  guildId,
  ...payload
}: ServerSettingsPayload & { guildId: string }) {
  return apiFetch<ServerSettings>(`/guild/${guildId}/settings`, {
    method: FetchMethods.Post,
    body: JSON.stringify(payload),
  });
}

export function useServerSettings(guildId: string) {
  return useQuery({
    queryKey: ["guild", guildId, "settings"],
    queryFn: () => fetchServerSettings(guildId),
    enabled: !!guildId,
  });
}

export function useUpdateServerSettings(guildId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ServerSettingsPayload) =>
      updateServerSettings({ guildId, ...payload }),
    onSuccess: (data) => {
      queryClient.setQueryData(["guild", guildId, "settings"], data);
    },
  });
}
