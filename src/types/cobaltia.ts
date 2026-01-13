export interface BankLeaderboard {
  avatar: string;
  bank: string;
  id: string;
  rank: number;
  tag: string;
}

export interface WalletLeaderboard {
  avatar: string;
  id: string;
  rank: number;
  tag: string;
  wallet: string;
}

export interface NetworthLeaderboard {
  avatar: string;
  id: string;
  networth: string;
  rank: number;
  tag: string;
}

export interface LevelLeaderboard {
  avatar: string;
  id: string;
  level: number;
  rank: number;
  tag: string;
}

export interface SocialCreditLeaderboard {
  avatar: string;
  id: string;
  rank: number;
  socialCredit: number;
  tag: string;
}

export interface VcTimeLeaderboard {
  avatar: string;
  duration: string;
  id: string;
  rank: number;
  tag: string;
}
