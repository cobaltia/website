"use client";

import { roundNumber } from "@sapphire/utilities";
import {
  IconWallet,
  IconBuildingBank,
  IconCoin,
  IconTrophy,
  IconStar,
  IconThumbUp,
  IconShieldDollar,
  IconTarget,
} from "@tabler/icons-react";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { UserStats } from "~/types/dashboard";

function formatCurrency(value: number): string {
  const num = roundNumber(value, 2);
  return `₡${num.toLocaleString()}`;
}

const statCards = [
  {
    key: "wallet",
    label: "Wallet",
    icon: IconWallet,
    format: (s: UserStats) => formatCurrency(s.wallet),
  },
  {
    key: "bank",
    label: "Bank",
    icon: IconBuildingBank,
    format: (s: UserStats) => formatCurrency(s.bankBalance),
  },
  {
    key: "bankLimit",
    label: "Bank Limit",
    icon: IconShieldDollar,
    format: (s: UserStats) => formatCurrency(s.bankLimit),
  },
  {
    key: "netWorth",
    label: "Net Worth",
    icon: IconCoin,
    format: (s: UserStats) => formatCurrency(s.netWorth),
  },
  {
    key: "bounty",
    label: "Bounty",
    icon: IconTarget,
    format: (s: UserStats) => formatCurrency(s.bounty),
  },
  {
    key: "level",
    label: "Level",
    icon: IconTrophy,
    format: (s: UserStats) => `Lv. ${s.level}`,
  },
  {
    key: "xp",
    label: "XP",
    icon: IconStar,
    format: (s: UserStats) => s.experience.toLocaleString(),
  },
  {
    key: "socialCredit",
    label: "Social Credit",
    icon: IconThumbUp,
    format: (s: UserStats) => `${s.socialCredit.toLocaleString()}/2,000`,
  },
] as const;

export function StatsOverview({ stats }: { stats: UserStats | undefined }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {statCards.map(({ key, label, icon: Icon, format }) => (
        <Card size="sm" key={key}>
          <CardHeader>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {format(stats)}
            </CardTitle>
            <CardAction>
              <Icon className="text-muted-foreground size-5" />
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
