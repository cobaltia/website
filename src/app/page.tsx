import { api, HydrateClient } from "~/trpc/server";
import { Header } from "./_components/header";
import { SidebarProvider } from "~/components/ui/sidebar";

export default async function Home() {
  return (
    <HydrateClient>
      <SidebarProvider>
        <main className="flex w-full flex-col">
          <Header />
          <div className="flex h-full flex-col items-center justify-center">
            <h1 className="text-center text-5xl">Cobalt Network</h1>
          </div>
        </main>
      </SidebarProvider>
    </HydrateClient>
  );
}
