"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { apiFetch } from "~/lib/utils";
import { Item } from "~/types/cobaltia";
import { cn } from "~/lib/utils";

function ItemIcon({ icon, size = 48 }: { icon: string; size?: number }) {
  const isEmoji = /^\p{Emoji}/u.test(icon) || icon.length <= 2;

  if (isEmoji) {
    return <span className={size >= 64 ? "text-5xl" : "text-3xl"}>{icon}</span>;
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

function ItemTile({
  item,
  isSelected,
  onClick,
}: {
  item: Item;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg p-3 transition-colors",
        isSelected
          ? "bg-zinc-300 dark:bg-zinc-700"
          : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800",
      )}
    >
      <div className="mb-2 flex h-16 w-16 items-center justify-center">
        <ItemIcon icon={item.icon} size={64} />
      </div>
      <p className="line-clamp-1 text-center text-sm font-medium">
        {item.displayName}
      </p>
    </div>
  );
}

function ItemDetailPanel({ item }: { item: Item }) {
  return (
    <Card className="sticky top-4 h-fit">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center">
            <ItemIcon icon={item.icon} size={64} />
          </div>
          <div>
            <CardTitle className="text-xl">{item.displayName}</CardTitle>
            {item.collectible && (
              <p className="text-muted-foreground text-sm">Collectible</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground italic">{item.description}</p>

        <div className="flex justify-between gap-4">
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">
              {item.price > 0 ? `₡${item.price.toLocaleString()}` : "-"}
            </span>
            <span className="text-muted-foreground text-sm">Buy Price</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">
              ₡{item.sellPrice.toLocaleString()}
            </span>
            <span className="text-muted-foreground text-sm">Sell Price</span>
          </div>
        </div>

        {item.collectible && (
          <div className="border-t pt-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span className="text-green-500">✓</span>
              <span>Collectible item</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Page() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchItems = async () => {
    const data = await apiFetch<Item[]>("/items");
    return data;
  };

  const { status, data } = useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 pb-3">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Items
        </h2>
      </div>
      <div>
        {status === "pending" && (
          <p className="text-muted-foreground text-center">Loading...</p>
        )}
        {status === "error" && (
          <p className="text-destructive text-center">
            Failed to load items. Please try again later.
          </p>
        )}
        {data && (
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Item Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {data.map((item) => (
                    <ItemTile
                      key={item.name}
                      item={item}
                      isSelected={selectedItem?.name === item.name}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              </div>

              {/* Detail Panel - Desktop */}
              <div className="hidden w-80 shrink-0 lg:block">
                {selectedItem ? (
                  <ItemDetailPanel item={selectedItem} />
                ) : (
                  <Card className="flex h-64 items-center justify-center">
                    <p className="text-muted-foreground">
                      Select an item to view details
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* Detail Panel - Mobile (shown below grid) */}
            {selectedItem && (
              <div className="mt-6 lg:hidden">
                <ItemDetailPanel item={selectedItem} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
