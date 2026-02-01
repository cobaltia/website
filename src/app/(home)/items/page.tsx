"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  IconSearch,
  IconSparkles,
  IconCoin,
  IconTag,
  IconPackage,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { apiFetch } from "~/lib/utils";
import { Item } from "~/types/cobaltia";

type FilterType = "all" | "collectible" | "buyable" | "sellable";

const FILTERS: { value: FilterType; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All", icon: <IconPackage className="size-4" /> },
  {
    value: "collectible",
    label: "Collectible",
    icon: <IconSparkles className="size-4" />,
  },
  { value: "buyable", label: "Buyable", icon: <IconCoin className="size-4" /> },
  {
    value: "sellable",
    label: "Sellable",
    icon: <IconTag className="size-4" />,
  },
];

function formatPrice(price: number): string {
  if (price < 0) return "Not for sale";
  return price.toLocaleString();
}

function ItemIcon({
  icon,
  size = "md",
}: {
  icon: string;
  size?: "sm" | "md" | "lg";
}) {
  const isEmoji = /^\p{Emoji}/u.test(icon) || icon.length <= 2;

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  const iconSizes = {
    sm: "size-6",
    md: "size-8",
    lg: "size-12",
  };

  if (isEmoji) {
    return <span className={sizeClasses[size]}>{icon}</span>;
  }

  return <IconPackage className={`text-muted-foreground ${iconSizes[size]}`} />;
}

function ItemDetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const { status, data } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const data = await apiFetch<Item[]>("/items");
      return data;
    },
  });

  const filteredItems = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesFilter = true;
      switch (filter) {
        case "collectible":
          matchesFilter = item.collectible;
          break;
        case "buyable":
          matchesFilter = item.price > 0;
          break;
        case "sellable":
          matchesFilter = item.sellPrice > 0;
          break;
      }

      return matchesSearch && matchesFilter;
    });
  }, [data, searchQuery, filter]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Items</h1>
        <p className="text-muted-foreground text-lg">
          Browse all items available in Cobalt Network
        </p>
      </div>

      {status === "pending" && (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <Spinner className="size-8" />
          <p className="text-muted-foreground">Loading items...</p>
        </div>
      )}

      {status === "error" && (
        <Card className="mx-auto max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-destructive">
              Failed to load items. Please try again later.
            </p>
          </CardContent>
        </Card>
      )}

      {data && (
        <>
          {/* Search and Filters */}
          <div className="mb-8 flex flex-col gap-4">
            {/* Search Bar */}
            <div className="relative mx-auto w-full max-w-md">
              <IconSearch className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FILTERS.map((f) => (
                <Button
                  key={f.value}
                  variant={filter === f.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f.value)}
                  className="gap-1.5"
                >
                  {f.icon}
                  {f.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Items count */}
          <p className="text-muted-foreground mb-4 text-center text-sm">
            Showing {filteredItems.length} item
            {filteredItems.length !== 1 ? "s" : ""}
            {filter !== "all" && ` (${filter})`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          {/* Items Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card
                  key={item.name}
                  className="group hover:border-primary/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedItem(item)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted flex size-12 items-center justify-center rounded-lg">
                          <ItemIcon icon={item.icon} />
                        </div>
                        <div>
                          <CardTitle className="text-base font-semibold">
                            {item.displayName}
                          </CardTitle>
                          {item.collectible && (
                            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                              <IconSparkles className="size-3" />
                              Collectible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between border-t pt-3">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">
                          Buy Price
                        </span>
                        <span className="font-medium">
                          {item.price > 0 ? (
                            <span className="flex items-center gap-1">
                              <IconCoin className="size-4 text-yellow-500" />
                              {formatPrice(item.price)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-muted-foreground text-xs">
                          Sell Price
                        </span>
                        <span className="font-medium">
                          {item.sellPrice > 0 ? (
                            <span className="flex items-center gap-1">
                              <IconCoin className="size-4 text-yellow-500" />
                              {formatPrice(item.sellPrice)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="mx-auto max-w-md">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No items found matching your criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Item Detail Sheet */}
      <Sheet
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <SheetContent side="right" className="overflow-y-auto">
          {selectedItem && (
            <>
              <SheetHeader>
                <div className="bg-muted mx-auto mb-4 flex size-20 items-center justify-center rounded-xl">
                  <ItemIcon icon={selectedItem.icon} size="lg" />
                </div>
                <SheetTitle className="text-center text-xl">
                  {selectedItem.displayName}
                </SheetTitle>
                <SheetDescription className="text-center">
                  {selectedItem.description}
                </SheetDescription>
              </SheetHeader>

              <div className="px-4">
                <Separator className="my-4" />

                {/* Item Properties */}
                <div className="space-y-1">
                  <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase">
                    Properties
                  </h3>

                  <ItemDetailRow label="Internal Name">
                    <code className="bg-muted rounded px-2 py-0.5 text-xs">
                      {selectedItem.name}
                    </code>
                  </ItemDetailRow>

                  <ItemDetailRow label="Collectible">
                    {selectedItem.collectible ? (
                      <span className="inline-flex items-center gap-1 text-yellow-500">
                        <IconSparkles className="size-4" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </ItemDetailRow>
                </div>

                <Separator className="my-4" />

                {/* Pricing */}
                <div className="space-y-1">
                  <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase">
                    Pricing
                  </h3>

                  <ItemDetailRow label="Buy Price">
                    {selectedItem.price > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <IconCoin className="size-4 text-yellow-500" />
                        {formatPrice(selectedItem.price)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not buyable</span>
                    )}
                  </ItemDetailRow>

                  <ItemDetailRow label="Sell Price">
                    {selectedItem.sellPrice > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <IconCoin className="size-4 text-yellow-500" />
                        {formatPrice(selectedItem.sellPrice)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Not sellable
                      </span>
                    )}
                  </ItemDetailRow>

                  {selectedItem.price > 0 && selectedItem.sellPrice > 0 && (
                    <ItemDetailRow label="Profit Margin">
                      <span
                        className={
                          selectedItem.sellPrice - selectedItem.price >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {selectedItem.sellPrice - selectedItem.price >= 0
                          ? "+"
                          : ""}
                        {formatPrice(
                          selectedItem.sellPrice - selectedItem.price,
                        )}
                      </span>
                    </ItemDetailRow>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Tags */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.collectible && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-500">
                        <IconSparkles className="size-3" />
                        Collectible
                      </span>
                    )}
                    {selectedItem.price > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                        <IconCoin className="size-3" />
                        Buyable
                      </span>
                    )}
                    {selectedItem.sellPrice > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-500">
                        <IconTag className="size-3" />
                        Sellable
                      </span>
                    )}
                    {selectedItem.price < 0 && selectedItem.sellPrice > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-500">
                        <IconPackage className="size-3" />
                        Special Drop
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
