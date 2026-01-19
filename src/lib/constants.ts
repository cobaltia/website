export const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
export const BASE_WEB_URL = process.env.NEXT_PUBLIC_BASE_WEB_URL;
export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const DiscordOauthURL = `https://discord.com/oauth2/authorize`;
export const oauthURL = new URL(DiscordOauthURL);
oauthURL.search = new URLSearchParams([
  ["redirect_uri", `${BASE_WEB_URL}/oauth/callback`],
  ["response_type", "code"],
  ["scope", ["identify", "guilds"].join(" ")],
  ["client_id", CLIENT_ID],
]).toString();

export enum LocalStorageKeys {
  HasCookieConsent = "allows_cookies",
  DiscordPack = "discord_pack",
  LastSync = "last_sync",
}

export enum FetchMethods {
  Post = "POST",
  Patch = "PATCH",
  Get = "GET",
}

export const NAV_ITEMS = [
  {
    title: "Commands",
    href: "/commands",
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
  },
  {
    title: "Items",
    href: "/items",
  },
  {
    title: "Network",
    href: "/network",
  },
];

export const LEADERBOARD_OPTIONS = [
  {
    value: "wallet",
    label: "Wallet",
  },
  {
    value: "bank",
    label: "Bank",
  },
  {
    value: "net_worth",
    label: "Net Worth",
  },
  {
    value: "level",
    label: "Level",
  },
  {
    value: "social_credit",
    label: "Social Credit",
  },
  {
    value: "vc_time",
    label: "VC Time",
  },
];
