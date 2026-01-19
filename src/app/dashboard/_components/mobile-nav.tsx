import Link from "next/link";
import { SidebarTrigger } from "~/components/ui/sidebar";

export function MobileNav() {
  return (
    <>
      <header className="mx-6 mt-6 flex flex-row items-center justify-between gap-3 sm:hidden">
        <div className="flex items-center gap-3">
          <h1>
            <Link href="/">CN</Link>
          </h1>
        </div>
        <SidebarTrigger />
      </header>
    </>
  );
}
