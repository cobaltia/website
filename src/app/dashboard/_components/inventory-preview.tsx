"use client";

import Image from "next/image";
import { useAuthenticated } from "~/contexts/AuthenticationContext";
import { useInventory } from "~/hooks/use-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "~/components/ui/empty";

function ItemIcon({ icon, size = 24 }: { icon: string; size?: number }) {
  const isEmoji = /^\p{Emoji}/u.test(icon) || icon.length <= 2;

  if (isEmoji) {
    return <span className="text-lg">{icon}</span>;
  }

  return (
    <Image
      src={`/icons/${icon}.webp`}
      alt="Item Icon"
      width={size}
      height={size}
    />
  );
}

const PREVIEW_LIMIT = 6;

export function InventoryPreview() {
  const authenticated = useAuthenticated();
  const { data, isLoading } = useInventory({ enabled: authenticated });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const items = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>
          {items.length} {items.length === 1 ? "item" : "items"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <Empty className="py-4">
            <EmptyHeader>
              <EmptyTitle>No items yet</EmptyTitle>
              <EmptyDescription>
                Items you collect will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-2">
            {items.slice(0, PREVIEW_LIMIT).map((entry) => (
              <div
                key={entry.itemId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ItemIcon icon={entry.icon} />
                  <span className="text-sm">{entry.displayName}</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  x{entry.quantity}
                </span>
              </div>
            ))}
            {items.length > PREVIEW_LIMIT && (
              <p className="text-muted-foreground text-xs">
                +{items.length - PREVIEW_LIMIT} more
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
