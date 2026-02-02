import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "~/lib/utils";
import { FetchMethods } from "~/lib/constants";

export interface ServerSettings {
  guildId: string;
  logChannelId: string | null;
  welcomeChannelId: string | null;
  voiceChannelId: string | null;
  welcomeMessage: string | null;
}

export interface SetupRequest {
  guildId: string;
  logChannelId?: string | null;
  welcomeChannelId?: string | null;
  voiceChannelId?: string | null;
  welcomeMessage?: string;
}

export interface SetupResponse {
  success: boolean;
  settings: ServerSettings;
}

export function useServerSettings(guildId: string | undefined) {
  return useQuery({
    queryKey: ["serverSettings", guildId],
    queryFn: async () => {
      if (!guildId) throw new Error("Guild ID is required");
      const data = await apiFetch<ServerSettings>(`/settings/${guildId}`);
      return data;
    },
    enabled: !!guildId,
  });
}

export function useUpdateServerSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: SetupRequest) => {
      const data = await apiFetch<SetupResponse>("/setup", {
        method: FetchMethods.Post,
        body: JSON.stringify(request),
      });
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch server settings
      queryClient.invalidateQueries({
        queryKey: ["serverSettings", variables.guildId],
      });
    },
  });
}
