"use client";

import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useExperienceHistory } from "~/hooks/use-dashboard";
import { cn, formatRelativeTime } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "~/components/ui/empty";
import { HistoryTableSkeleton } from "./history-table-skeleton";

export function ExperienceHistoryTable() {
  const authenticated = useAuthenticated();
  const { data, isLoading } = useExperienceHistory({ enabled: authenticated });

  if (isLoading) return <HistoryTableSkeleton />;

  const entries = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent XP</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <Empty className="py-4">
            <EmptyHeader>
              <EmptyTitle>No XP history yet</EmptyTitle>
              <EmptyDescription>
                Your experience gains will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell
                    className={cn(
                      "font-medium",
                      entry.amount < 0 ? "text-red-500" : "text-green-500",
                    )}
                  >
                    {entry.amount < 0
                      ? entry.amount.toLocaleString()
                      : `+${entry.amount.toLocaleString()}`}
                  </TableCell>
                  <TableCell>
                    {entry.reason}
                    {entry.levelUp && (
                      <span className="ml-2 text-xs text-yellow-500">
                        Level Up!
                      </span>
                    )}
                  </TableCell>
                  <TableCell
                    className="text-muted-foreground text-right"
                    title={new Date(entry.createdAt).toLocaleString()}
                  >
                    {formatRelativeTime(entry.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
