"use client";

import { SidebarTrigger } from "~/components/ui/sidebar";
import { Nav } from "./nav";
import { NavSidebar } from "./nav-sidebar";
import { UserNav } from "./user-nav";
import { RightNav } from "./right-nav";

export function Header() {
  return (
    <header className="mx-6 mt-6 flex flex-row items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <h1>CN</h1>
        <div className="hidden sm:flex">
          <Nav />
        </div>
      </div>
      <div className="hidden items-center gap-3 sm:flex">
        <RightNav />
      </div>
      <div className="sm:hidden">
        <SidebarTrigger />
        <NavSidebar>
          <UserNav />
        </NavSidebar>
      </div>
    </header>
  );
}
