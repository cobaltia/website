"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";

export default function Page() {
  const [value, setValue] = useState("admin");

  return (
    <>
      {/*<div className="flex flex-col items-center justify-center gap-3 pb-3">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Commands
        </h2>
      </div>
      <div>
        {isLoading && (
          <p className="text-muted-foreground text-center">Loading...</p>
        )}
        {isError && (
          <p className="text-destructive text-center">
            Failed to load commands. Please try again later.
          </p>
        )}
        {commands && (
          <>
            <div className="flex items-center justify-center">
              <NavigationMenu className="mb-3">
                <NavigationMenuList>
                  {commands.map((category) => (
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
              {commands
                .filter((category) => category.name === value)
                .map((category) => (
                  <div
                    key={category.name}
                    className="flex flex-col gap-3 sm:w-2xl"
                  >
                    {category.commands.map((command) => (
                      <div
                        key={command.name}
                        className="rounded-sm bg-zinc-100 p-6 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                      >
                        {!command.subcommands && (
                          <h3 className="mb-1 font-bold">/{command.name}</h3>
                        )}
                        {command.subcommands?.map((subcommand) => (
                          <>
                            <h3 className="mb-1 font-bold">
                              /{command.name} {subcommand.name}
                            </h3>
                          </>
                        ))}
                        <p>{command.description}</p>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>*/}
      Commands
    </>
  );
}
