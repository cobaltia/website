"use client";

import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useMoneyHistory } from "~/hooks/use-dashboard";
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

export function MoneyHistoryTable() {
  const authenticated = useAuthenticated();
  const { data, isLoading } = useMoneyHistory({ enabled: authenticated });

  if (isLoading) return <HistoryTableSkeleton />;

  const transactions = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <Empty className="py-4">
            <EmptyHeader>
              <EmptyTitle>No transactions yet</EmptyTitle>
              <EmptyDescription>
                Your money activity will appear here.
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
              {transactions.map((tx) => {
                const formatted = `₡${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
                return (
                  <TableRow key={tx.id}>
                    <TableCell
                      className={cn(
                        "font-medium",
                        tx.earned ? "text-green-500" : "text-red-500",
                      )}
                    >
                      {tx.earned ? `+${formatted}` : `-${formatted}`}
                    </TableCell>
                    <TableCell>{tx.reason}</TableCell>
                    <TableCell
                      className="text-muted-foreground text-right"
                      title={new Date(tx.createdAt).toLocaleString()}
                    >
                      {formatRelativeTime(tx.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
