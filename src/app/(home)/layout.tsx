import React from "react";
import { Header } from "./_components/header";
import { SidebarProvider } from "~/components/ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <main className="flex w-full flex-col">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
