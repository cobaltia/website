"use client";

import { useState } from "react";
import {
  IconWallet,
  IconBuildingBank,
  IconCoin,
  IconTrophy,
  IconStar,
  IconClock,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import LeaderboardList from "./_components/leaderboard-list";
import {
  BankLeaderboard,
  LevelLeaderboard,
  NetworthLeaderboard,
  SocialCreditLeaderboard,
  VcTimeLeaderboard,
  WalletLeaderboard,
} from "~/types/cobaltia";

const LEADERBOARD_CATEGORIES = [
  {
    value: "level",
    label: "Level",
    icon: IconTrophy,
    endpoint: "/leaderboard?id=level",
    getValue: (entry: LevelLeaderboard) => entry.level,
    valueLabel: "Level",
  },
  {
    value: "wallet",
    label: "Wallet",
    icon: IconWallet,
    endpoint: "/leaderboard?id=wallet",
    getValue: (entry: WalletLeaderboard) => entry.wallet,
    valueLabel: "Coins",
  },
  {
    value: "bank",
    label: "Bank",
    icon: IconBuildingBank,
    endpoint: "/leaderboard?id=bank",
    getValue: (entry: BankLeaderboard) => entry.bank,
    valueLabel: "Coins",
  },
  {
    value: "net_worth",
    label: "Net Worth",
    icon: IconCoin,
    endpoint: "/leaderboard?id=networth",
    getValue: (entry: NetworthLeaderboard) => entry.networth,
    valueLabel: "Total",
  },
  {
    value: "social_credit",
    label: "Social Credit",
    icon: IconStar,
    endpoint: "/leaderboard?id=socialcredit",
    getValue: (entry: SocialCreditLeaderboard) => entry.socialCredit,
    valueLabel: "Score",
  },
  {
    value: "vc_time",
    label: "VC Time",
    icon: IconClock,
    endpoint: "/leaderboard?id=vctime",
    getValue: (entry: VcTimeLeaderboard) => entry.duration,
    valueLabel: "Time",
  },
] as const;

type CategoryValue = (typeof LEADERBOARD_CATEGORIES)[number]["value"];

export default function LeaderboardPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryValue>("level");

  const currentCategory = LEADERBOARD_CATEGORIES.find(
    (cat) => cat.value === selectedCategory,
  )!;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground text-lg">
          See who&apos;s on top across the Cobalt Network
        </p>
      </div>

      {/* Category Tabs */}
      <Card className="mb-8">
        <CardContent className="p-2">
          <div className="flex flex-wrap justify-center gap-1">
            {LEADERBOARD_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.value;
              return (
                <Button
                  key={category.value}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="gap-1.5"
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Category Title */}
      <div className="mb-6 flex items-center justify-center gap-2">
        <currentCategory.icon className="text-primary size-6" />
        <h2 className="text-2xl font-semibold">{currentCategory.label}</h2>
      </div>

      {/* Leaderboard Content */}
      <div className="flex justify-center">
        {selectedCategory === "level" && (
          <LeaderboardList<LevelLeaderboard>
            queryKey="level"
            endpoint="/leaderboard?id=level"
            getValue={(entry) => entry.level}
          />
        )}
        {selectedCategory === "wallet" && (
          <LeaderboardList<WalletLeaderboard>
            queryKey="wallet"
            endpoint="/leaderboard?id=wallet"
            getValue={(entry) => entry.wallet}
          />
        )}
        {selectedCategory === "bank" && (
          <LeaderboardList<BankLeaderboard>
            queryKey="bank"
            endpoint="/leaderboard?id=bank"
            getValue={(entry) => entry.bank}
          />
        )}
        {selectedCategory === "net_worth" && (
          <LeaderboardList<NetworthLeaderboard>
            queryKey="networth"
            endpoint="/leaderboard?id=networth"
            getValue={(entry) => entry.networth}
          />
        )}
        {selectedCategory === "social_credit" && (
          <LeaderboardList<SocialCreditLeaderboard>
            queryKey="socialcredit"
            endpoint="/leaderboard?id=socialcredit"
            getValue={(entry) => entry.socialCredit}
          />
        )}
        {selectedCategory === "vc_time" && (
          <LeaderboardList<VcTimeLeaderboard>
            queryKey="vctime"
            endpoint="/leaderboard?id=vctime"
            getValue={(entry) => entry.duration}
          />
        )}
      </div>
    </div>
  );
}
