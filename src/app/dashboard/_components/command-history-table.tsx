"use client";

import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useCommandHistory } from "~/hooks/use-dashboard";
import { formatRelativeTime } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "~/components/ui/empty";
import { HistoryTableSkeleton } from "./history-table-skeleton";

export function CommandHistoryTable() {
  const authenticated = useAuthenticated();
  const { data, isLoading } = useCommandHistory({ enabled: authenticated });

  if (isLoading) return <HistoryTableSkeleton />;

  const entries = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Commands</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <Empty className="py-4">
            <EmptyHeader>
              <EmptyTitle>No commands yet</EmptyTitle>
              <EmptyDescription>
                Your command usage will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Command</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">
                      /{entry.command}
                    </code>
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
