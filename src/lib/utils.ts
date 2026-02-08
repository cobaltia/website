import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import isBrowser from "./isBrowser";
import { BASE_API_URL, FetchMethods, LocalStorageKeys } from "./constants";
import { TransformedLoginData } from "~/types/apiData";
import { ValuesType } from "utility-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const loadState = <T>(key: LocalStorageKeys): T | null => {
  if (isBrowser) {
    const serializedState = localStorage.getItem(key);
    return serializedState ? (JSON.parse(serializedState) as T) : null;
  }

  return null;
};

export const saveState = <T>(key: LocalStorageKeys, state: T): T => {
  try {
    if (isBrowser) {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(key, serializedState);
    }
  } catch {
    // intentionally empty
  }

  return state;
};

export const clearState = (key: LocalStorageKeys) => {
  if (isBrowser) {
    localStorage.removeItem(key);
  }
};

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });

  const jsonReponse = await response.json();

  if (jsonReponse.error) {
    throw response;
  } else {
    return jsonReponse as T;
  }
}

type SetPackCallback = (newPack: Partial<TransformedLoginData>) => void;
type SetAuthenticatedCallback = (newAuthenticated: boolean) => void;
type ChangeRouteCallback = (newRoute: string) => void;

export async function logOut() {
  await apiFetch("/oauth/logout", { method: FetchMethods.Post });
}

export function clearData(
  setPack: SetPackCallback,
  setAuthenticated: SetAuthenticatedCallback,
  changeRoute: ChangeRouteCallback,
) {
  clearState(LocalStorageKeys.DiscordPack);
  clearState(LocalStorageKeys.LastSync);
  setPack({ user: null });
  setAuthenticated(false);
  changeRoute("/");
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return "just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function displayIconURL(
  guild: ValuesType<TransformedLoginData["transformedGuilds"]>,
  { format = "default", size = 256 } = {},
) {
  if (!guild.icon) return undefined;
  if (format === "default")
    format = guild.icon.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${format}?size=${size}`;
}

export function displayBannerURL(
  guild: ValuesType<TransformedLoginData["transformedGuilds"]>,
  { format = "default", size = 256 } = {},
) {
  if (format === "default")
    format = guild.banner && guild.banner.startsWith("a_") ? "gif" : "png";
  if (guild.banner)
    return `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.${format}?size=${size}`;
  if (guild.splash)
    return `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.${format}?size=${size}`;
  return undefined;
}
