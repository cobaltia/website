"use client";

import Link from "next/link";
import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useDiscordPack } from "~/contexts/DiscordPackContext";
import { useUserStats } from "~/hooks/use-dashboard";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { StatsOverview } from "./_components/stats-overview";
import { StatsSkeleton } from "./_components/stats-skeleton";
import { MoneyHistoryTable } from "./_components/money-history-table";
import { ExperienceHistoryTable } from "./_components/experience-history-table";
import { CommandHistoryTable } from "./_components/command-history-table";
import { VoiceHistoryTable } from "./_components/voice-history-table";
import { InventoryPreview } from "./_components/inventory-preview";

export default function Page() {
  const authenticated = useAuthenticated();
  const pack = useDiscordPack();
  const user = pack?.user;

  const { data: stats, isLoading: statsLoading } = useUserStats({
    enabled: authenticated,
  });

  if (!authenticated || !user) {
    return <div className="p-6">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div>
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          Home Dashboard
        </h2>
        <p className="text-muted-foreground text-sm">
          Welcome back, {user.username}
        </p>
      </div>

      {statsLoading ? <StatsSkeleton /> : <StatsOverview stats={stats} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Server Dashboard</CardTitle>
            <CardDescription>Manage your server settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              nativeButton={false}
              render={<Link href="/dashboard/servers">View Servers</Link>}
            />
          </CardContent>
        </Card>

        <InventoryPreview />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MoneyHistoryTable />
        <VoiceHistoryTable />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CommandHistoryTable />
        <ExperienceHistoryTable />
      </div>
    </div>
  );
}
