import { useEffect, useRef, useState } from "react";
import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { apiFetch } from "~/lib/utils";
import { BASE_API_URL } from "~/lib/constants";
import type { AuditEvent, AuditLogResponse } from "~/types/audit";

const AUDIT_LOG_LIMIT = 50;

function auditLogQueryKey(guildId: string) {
  return ["guild", guildId, "audit-log"] as const;
}

async function fetchAuditLog(guildId: string, before?: string) {
  const params = new URLSearchParams({
    guildId,
    limit: String(AUDIT_LOG_LIMIT),
  });
  if (before) params.set("before", before);
  return apiFetch<AuditLogResponse>(`/events?${params.toString()}`);
}

export function useAuditLog(guildId: string) {
  return useInfiniteQuery({
    queryKey: auditLogQueryKey(guildId),
    queryFn: ({ pageParam }) => fetchAuditLog(guildId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length < AUDIT_LOG_LIMIT) return undefined;
      return lastPage.data[lastPage.data.length - 1]?.createdAt;
    },
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      events: data.pages.flatMap((page) => page.data),
    }),
  });
}

type StreamStatus = "connecting" | "connected" | "disconnected";

export function useAuditStream(guildId: string) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<StreamStatus>("disconnected");
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const url = `${BASE_API_URL}/events/stream?guildId=${encodeURIComponent(guildId)}`;
    const eventSource = new EventSource(url, { withCredentials: true });
    eventSourceRef.current = eventSource;
    setStatus("connecting");

    eventSource.onopen = () => {
      setStatus("connected");
    };

    eventSource.onmessage = (event) => {
      try {
        const auditEvent = JSON.parse(event.data) as AuditEvent;

        queryClient.setQueryData<InfiniteData<AuditLogResponse>>(
          auditLogQueryKey(guildId),
          (old) => {
            if (!old) return old;
            const firstPage = old.pages[0];
            if (!firstPage) return old;
            return {
              ...old,
              pages: [
                { data: [auditEvent, ...firstPage.data] },
                ...old.pages.slice(1),
              ],
            };
          },
        );
      } catch {
        // ignore malformed messages
      }
    };

    eventSource.onerror = () => {
      setStatus("disconnected");
    };

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
      setStatus("disconnected");
    };
  }, [guildId, queryClient]);

  return { status };
}
