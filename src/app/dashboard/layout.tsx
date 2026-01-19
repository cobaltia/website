import { SidebarProvider } from "~/components/ui/sidebar";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { MobileNav } from "./_components/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <DashboardSidebar />
      <main className="flex w-full flex-col">
        <MobileNav />
        {children}
      </main>
    </SidebarProvider>
  );
}
