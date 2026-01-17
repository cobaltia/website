import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
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

export function RightNav() {
  const { setTheme, theme } = useTheme();
  const authenticated = useAuthenticated();
  const writeAuthenticated = setAuthenticated();
  const setPack = mergeDiscordPack();
  const pack = useDiscordPack();
  const user = pack?.user;
  const Router = useRouter();

  if (!authenticated) {
    return (
      <>
        <Button
          className="cursor-pointer"
          onClick={() => Router.push(oauthURL.toString())}
        >
          Sign In
        </Button>
        <Button
          className="cursor-pointer"
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <IconSun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
          <IconMoon className="hidden h-5 w-5 dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <Avatar>
            <AvatarImage
              src={displayAvatarURL(user)}
              alt={user?.username ?? undefined}
            />
            <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] rounded-lg"
          side="bottom"
          align="center"
        >
          <DropdownMenuItem className="cursor-pointer">
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="w-full cursor-pointer"
            onClick={async () => {
              await logOut();
              clearData(setPack, writeAuthenticated, Router.push);
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        className="cursor-pointer"
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <IconSun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
        <IconMoon className="hidden h-5 w-5 dark:block" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  );
}
