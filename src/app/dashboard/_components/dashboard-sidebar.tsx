"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { IconHome2, IconInbox, IconSettings } from "@tabler/icons-react";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: IconHome2,
  },
  {
    title: "Servers",
    url: "/dashboard/servers",
    icon: IconInbox,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: IconSettings,
  },
];
export function DashboardSidebar() {
  const { isMobile } = useSidebar();

  return (
    <Sidebar variant="sidebar" side={isMobile ? "right" : "left"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:!p-1.5"
              render={
                <Link href="/">
                  <span className="text-base font-semibold">
                    Cobalt Network
                  </span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <a href={item.url} className="flex items-center gap-1.5">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
