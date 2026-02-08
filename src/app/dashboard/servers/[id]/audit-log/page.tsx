"use client";

import { useParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useDiscordPack } from "~/contexts/DiscordPackContext";
import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useAuditLog, useAuditStream } from "~/hooks/use-audit-log";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

function StreamIndicator({ status }: { status: string }) {
  const color =
    status === "connected"
      ? "bg-green-500"
      : status === "connecting"
        ? "bg-yellow-500"
        : "bg-red-500";

  const label =
    status === "connected"
      ? "Live"
      : status === "connecting"
        ? "Connecting"
        : "Disconnected";

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block size-2 rounded-full ${color}`} />
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
  );
}

export default function Page() {
  const params = useParams<{ id: string }>();
  const authenticated = useAuthenticated();
  const pack = useDiscordPack();
  const server = pack.transformedGuilds?.find((g) => g.id === params.id);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useAuditLog(params.id);

  const { status } = useAuditStream(params.id);

  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!authenticated) return <div>Please log in to view this server.</div>;
  if (!server) return <div>Server not found.</div>;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-8" />
      </div>
    );
  }

  const events = data?.events ?? [];

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Audit Log</CardTitle>
            <CardDescription>Recent activity for {server.name}</CardDescription>
          </div>
          <StreamIndicator status={status} />
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={events} />
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isFetchingNextPage && <Spinner className="size-6" />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
