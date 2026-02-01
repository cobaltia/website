import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { NAV_ITEMS } from "~/lib/constants";

export function Nav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {NAV_ITEMS.map((item) => (
          <NavigationMenuItem key={item.title}>
            <Link href={item.href}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {item.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
