import { IconDotsVertical, IconLogout } from "@tabler/icons-react";
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
  useSidebar,
} from "~/components/ui/sidebar";
import {
  setAuthenticated,
  useAuthenticated,
} from "~/contexts/AuthenticationContext";
import {
  mergeDiscordPack,
  useDiscordPack,
} from "~/contexts/DiscordPackContext";
import { displayAvatarURL } from "~/lib/discordUtils";
import { clearData, logOut } from "~/lib/utils";

export function NavUser() {
  const { isMobile } = useSidebar();
  const authenticated = useAuthenticated();
  const writeAuthenticated = setAuthenticated();
  const setPack = mergeDiscordPack();
  const pack = useDiscordPack();
  const user = pack?.user;
  const Router = useRouter();

  if (!authenticated) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <SidebarMenuButton>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={displayAvatarURL(user)}
                  alt={user?.username}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.username?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {user?.username}
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={9}
          >
            <DropdownMenuItem>
              <a href="/dashboard/settings">Settings</a>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await logOut();
                clearData(setPack, writeAuthenticated, Router.push);
              }}
            >
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
