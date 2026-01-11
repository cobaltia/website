import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function RightNav() {
  const { setTheme, theme } = useTheme();

  // if (!isLoaded) {
  //   return <div>Loading...</div>;
  // }

  // if (!isSignedIn) {
  //   return (
  //     <>
  //       <Button asChild className="cursor-pointer">
  //         <SignInButton />
  //       </Button>
  //       <Button
  //         className="cursor-pointer"
  //         variant="ghost"
  //         size="icon"
  //         onClick={() => setTheme(theme === "light" ? "dark" : "light")}
  //       >
  //         <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
  //         <Moon className="hidden h-5 w-5 dark:block" />
  //         <span className="sr-only">Toggle theme</span>
  //       </Button>
  //     </>
  //   );
  // }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          {/*<Avatar>
            <AvatarImage src={user.imageUrl} alt={user.username ?? undefined} />
            <AvatarFallback>{user.username?.[0]}</AvatarFallback>
          </Avatar>*/}
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
          <DropdownMenuItem className="w-full cursor-pointer">
            {/*<SignOutButton />*/}
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
