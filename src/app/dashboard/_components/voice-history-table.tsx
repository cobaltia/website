"use client";

import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useVoiceHistory } from "~/hooks/use-dashboard";
import { formatRelativeTime } from "~/lib/utils";
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

export function VoiceHistoryTable() {
  const authenticated = useAuthenticated();
  const { data, isLoading } = useVoiceHistory({ enabled: authenticated });

  if (isLoading) return <HistoryTableSkeleton />;

  const sessions = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Voice Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <Empty className="py-4">
            <EmptyHeader>
              <EmptyTitle>No voice sessions yet</EmptyTitle>
              <EmptyDescription>
                Your voice activity will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Duration</TableHead>
                <TableHead>Earned</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    {session.duration}
                  </TableCell>
                  <TableCell className="text-green-500">
                    +₡
                    {session.earned.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    })}
                  </TableCell>
                  <TableCell
                    className="text-muted-foreground text-right"
                    title={new Date(session.date).toLocaleString()}
                  >
                    {formatRelativeTime(session.date)}
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
