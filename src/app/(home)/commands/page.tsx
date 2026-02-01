"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { apiFetch } from "~/lib/utils";
import { CommandResponse } from "~/types/cobaltia";

export default function Page() {
  const [value, setValue] = useState("general");
  const fetchCommands = async () => {
    const data = await apiFetch<CommandResponse[]>("/commands");
    return data;
  };

  const { status, data } = useQuery({
    queryKey: ["commands"],
    queryFn: fetchCommands,
  });

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 pb-3">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Commands
        </h2>
      </div>
      <div>
        {status === "pending" && (
          <p className="text-muted-foreground text-center">Loading...</p>
        )}
        {status === "error" && (
          <p className="text-destructive text-center">
            Failed to load commands. Please try again later.
          </p>
        )}
        {data && (
          <>
            <div className="flex items-center justify-center">
              <NavigationMenu className="mb-3">
                <NavigationMenuList className="gap-1">
                  {data.map((category) => (
                    <NavigationMenuItem
                      key={category.name}
                      onClick={() => setValue(category.name)}
                    >
                      <Button
                        className="cursor-pointer"
                        variant={
                          value === category.name ? "default" : "secondary"
                        }
                      >
                        {category.name}
                      </Button>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div className="flex justify-center">
              {data
                .filter((category) => category.name === value)
                .map((category) => (
                  <div
                    key={category.name}
                    className="flex flex-col gap-3 sm:w-2xl"
                  >
                    {category.commands.map((command) => (
                      <Card
                        key={command.name}
                        className="transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <CardHeader>
                          <CardTitle>/{command.name}</CardTitle>
                        </CardHeader>
                        <CardContent>{command.description}</CardContent>
                      </Card>
                    ))}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
