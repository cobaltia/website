import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import isBrowser from "./isBrowser";
import { BASE_API_URL, FetchMethods, LocalStorageKeys } from "./constants";
import { TransformedLoginData } from "~/types/apiData";

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
