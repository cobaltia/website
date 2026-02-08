import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "~/lib/utils";
import type {
  UserStats,
  PaginatedResponse,
  MoneyTransaction,
  ExperienceEntry,
  CommandUsageEntry,
  VoiceSession,
  InventoryItem,
} from "~/types/dashboard";

const RECENT_LIMIT = 5;

export function useUserStats(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", "stats"],
    queryFn: () => apiFetch<UserStats>("/users/@me/stats"),
    enabled: options?.enabled ?? true,
  });
}

export function useMoneyHistory(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", "history", "money"],
    queryFn: () =>
      apiFetch<PaginatedResponse<MoneyTransaction>>(
        `/users/@me/history/money?limit=${RECENT_LIMIT}`,
      ),
    enabled: options?.enabled ?? true,
  });
}

export function useExperienceHistory(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", "history", "experience"],
    queryFn: () =>
      apiFetch<PaginatedResponse<ExperienceEntry>>(
        `/users/@me/history/experience?limit=${RECENT_LIMIT}`,
      ),
    enabled: options?.enabled ?? true,
  });
}

export function useCommandHistory(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", "history", "commands"],
    queryFn: () =>
      apiFetch<PaginatedResponse<CommandUsageEntry>>(
        `/users/@me/history/commands?limit=${RECENT_LIMIT}`,
      ),
    enabled: options?.enabled ?? true,
  });
}

export function useVoiceHistory(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", "history", "voice"],
    queryFn: () =>
      apiFetch<PaginatedResponse<VoiceSession>>(
        `/users/@me/history/voice?limit=${RECENT_LIMIT}`,
      ),
    enabled: options?.enabled ?? true,
  });
}

export function useInventory(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", "inventory"],
    queryFn: () =>
      apiFetch<PaginatedResponse<InventoryItem>>("/users/@me/inventory"),
    enabled: options?.enabled ?? true,
  });
}
