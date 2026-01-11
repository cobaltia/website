import { SidebarProvider } from "~/components/ui/sidebar";
import { HydrateClient } from "~/trpc/server";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { MobileNav } from "./_components/mobile-nav";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const _auth = await auth();
  const tokens = await _auth.getToken();
  console.log(tokens);

  return (
    <HydrateClient>
      <SidebarProvider defaultOpen>
        <DashboardSidebar />
        <main className="flex w-full flex-col">
          <MobileNav />
          {children}
        </main>
      </SidebarProvider>
    </HydrateClient>
  );
}
