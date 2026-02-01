"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  IconSearch,
  IconTerminal2,
  IconCoin,
  IconUsers,
  IconShield,
  IconSparkles,
  IconCategory,
} from "@tabler/icons-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { apiFetch } from "~/lib/utils";
import { CommandResponse } from "~/types/cobaltia";

const categoryIcons: Record<string, React.ReactNode> = {
  economy: <IconCoin className="size-4" />,
  general: <IconTerminal2 className="size-4" />,
  admin: <IconShield className="size-4" />,
  fun: <IconSparkles className="size-4" />,
  social: <IconUsers className="size-4" />,
};

function getCategoryIcon(category: string) {
  return (
    categoryIcons[category.toLowerCase()] || <IconCategory className="size-4" />
  );
}

export default function CommandsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { status, data } = useQuery({
    queryKey: ["commands"],
    queryFn: async () => {
      const data = await apiFetch<CommandResponse[]>("/commands");
      return data;
    },
  });

  // Get all commands flattened with their category
  const allCommands = useMemo(() => {
    if (!data) return [];
    return data.flatMap((category) =>
      category.commands.map((command) => ({
        ...command,
        categoryName: category.name,
      })),
    );
  }, [data]);

  // Filter commands based on category and search
  const filteredCommands = useMemo(() => {
    return allCommands.filter((command) => {
      const matchesCategory =
        !selectedCategory ||
        command.categoryName.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        command.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allCommands, selectedCategory, searchQuery]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!data) return [];
    return data.map((category) => category.name);
  }, [data]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Commands</h1>
        <p className="text-muted-foreground text-lg">
          Explore all available commands for Cobalt Network
        </p>
      </div>

      {status === "pending" && (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <Spinner className="size-8" />
          <p className="text-muted-foreground">Loading commands...</p>
        </div>
      )}

      {status === "error" && (
        <Card className="mx-auto max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-destructive">
              Failed to load commands. Please try again later.
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
                placeholder="Search commands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="gap-1.5"
              >
                <IconCategory className="size-4" />
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory?.toLowerCase() === category.toLowerCase()
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="gap-1.5 capitalize"
                >
                  {getCategoryIcon(category)}
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Commands count */}
          <p className="text-muted-foreground mb-4 text-center text-sm">
            Showing {filteredCommands.length} command
            {filteredCommands.length !== 1 ? "s" : ""}
            {selectedCategory && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          {/* Commands Grid */}
          {filteredCommands.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCommands.map((command) => (
                <Card
                  key={`${command.categoryName}-${command.name}`}
                  className="group hover:border-primary/50 transition-colors"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="font-mono text-base font-semibold">
                        /{command.name}
                      </CardTitle>
                      <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs capitalize">
                        {getCategoryIcon(command.categoryName)}
                        {command.categoryName}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {command.description}
                    </p>
                    {command.subcommand && command.subcommand.length > 0 && (
                      <div className="mt-3 border-t pt-3">
                        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                          Subcommands
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {command.subcommand.map((sub) => (
                            <code
                              key={sub.name}
                              className="bg-muted rounded px-1.5 py-0.5 text-xs"
                            >
                              {sub.name}
                            </code>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="mx-auto max-w-md">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  No commands found matching your criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
