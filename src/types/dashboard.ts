export interface UserStats {
  wallet: number;
  bankBalance: number;
  bankLimit: number;
  netWorth: number;
  bounty: number;
  experience: number;
  level: number;
  socialCredit: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
}

export interface MoneyTransaction {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  earned: boolean;
  createdAt: string;
}

export interface ExperienceEntry {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  levelUp: boolean;
  createdAt: string;
}

export interface CommandUsageEntry {
  id: string;
  userId: string;
  command: string;
  createdAt: string;
}

export interface VoiceSession {
  id: string;
  userId: string;
  duration: string;
  earned: number;
  date: string;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  displayName: string;
  description: string;
  icon: string;
  price: number;
  sellPrice: number;
}
