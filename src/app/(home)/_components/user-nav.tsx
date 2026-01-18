"use client";

import { IconSelector } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import {
  setAuthenticated,
  useAuthenticated,
} from "~/contexts/AuthenticationContext";
import {
  mergeDiscordPack,
  useDiscordPack,
} from "~/contexts/DiscordPackContext";
import { oauthURL } from "~/lib/constants";
import { displayAvatarURL } from "~/lib/discordUtils";
import { clearData, logOut } from "~/lib/utils";

export function UserNav() {
  const authenticated = useAuthenticated();
  const writeAuthenticated = setAuthenticated();
  const setPack = mergeDiscordPack();
  const pack = useDiscordPack();
  const user = pack?.user;
  const Router = useRouter();

  if (!authenticated) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            onClick={() => Router.push(oauthURL.toString())}
          >
            Sign In
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={displayAvatarURL(user)}
                  alt={user?.username ?? undefined}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.username?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {user?.username}
              </div>
              <IconSelector />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="start"
          >
            <DropdownMenuItem>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await logOut();
                clearData(setPack, writeAuthenticated, Router.push);
              }}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
