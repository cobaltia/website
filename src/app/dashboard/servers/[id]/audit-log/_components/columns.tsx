"use client";

import { useEffect, useReducer } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { AuditAction, type AuditEvent } from "~/types/audit";
import { formatRelativeTime } from "~/lib/utils";

const ACTION_LABELS: Record<AuditAction, string> = {
  [AuditAction.GOVERNMENT_ROLE_ADDED]: "Gov. Role Added",
  [AuditAction.GOVERNMENT_ROLE_REMOVED]: "Gov. Role Removed",
  [AuditAction.GUILD_SETTING_UPDATED]: "Setting Updated",
};

function RelativeTime({ date }: { date: string }) {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const id = setInterval(forceUpdate, 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="text-muted-foreground text-sm"
      title={new Date(date).toLocaleString()}
    >
      {formatRelativeTime(date)}
    </span>
  );
}

export const columns: ColumnDef<AuditEvent>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.getValue<AuditAction>("action");
      return (
        <span className="bg-muted rounded-md px-2 py-1 text-xs font-medium">
          {ACTION_LABELS[action] ?? action}
        </span>
      );
    },
  },
  {
    accessorKey: "userId",
    header: "User",
    cell: ({ row }) => (
      <span className="font-mono text-sm">
        {row.getValue<string>("userId")}
      </span>
    ),
  },
  {
    accessorKey: "metadata",
    header: "Details",
    cell: ({ row }) => {
      const metadata = row.getValue<string | null>("metadata");
      if (!metadata) return <span className="text-muted-foreground">—</span>;
      return <span className="max-w-48 truncate text-sm">{metadata}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Time",
    cell: ({ row }) => (
      <RelativeTime date={row.getValue<string>("createdAt")} />
    ),
  },
];
