import type {
  BankLeaderboard,
  LevelLeaderboard,
  NetworthLeaderboard,
  SocialCreditLeaderboard,
  VcTimeLeaderboard,
  WalletLeaderboard,
} from "~/types/cobaltia";

export interface LeaderboardEntry {
  avatar: string;
  id: string;
  rank: number;
  tag: string;
}

export interface LeaderboardConfig {
  value: string;
  label: string;
  apiId: string;
  formatValue: (entry: LeaderboardEntry) => string;
}

export const LEADERBOARD_CONFIG: LeaderboardConfig[] = [
  {
    value: "wallet",
    label: "Wallet",
    apiId: "wallet",
    formatValue: (d) => `₡${(d as unknown as WalletLeaderboard).wallet}`,
  },
  {
    value: "bank",
    label: "Bank",
    apiId: "bank",
    formatValue: (d) => `₡${(d as unknown as BankLeaderboard).bank}`,
  },
  {
    value: "net_worth",
    label: "Net Worth",
    apiId: "networth",
    formatValue: (d) => `₡${(d as unknown as NetworthLeaderboard).networth}`,
  },
  {
    value: "level",
    label: "Level",
    apiId: "level",
    formatValue: (d) => `${(d as unknown as LevelLeaderboard).level}`,
  },
  {
    value: "social_credit",
    label: "Social Credit",
    apiId: "socialcredit",
    formatValue: (d) =>
      `${(d as unknown as SocialCreditLeaderboard).socialCredit}/2,000`,
  },
  {
    value: "vc_time",
    label: "VC Time",
    apiId: "vctime",
    formatValue: (d) => `${(d as unknown as VcTimeLeaderboard).duration}`,
  },
];
