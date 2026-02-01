"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center overflow-hidden px-4">
      {/* Background Logo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <Image
          src="/Cobalt_Seal1.png"
          alt=""
          width={800}
          height={800}
          className="h-150 w-150 opacity-[0.03] sm:h-200 sm:w-200"
          priority
        />
      </div>

      {/* Gradient orbs for ambiance */}
      <div className="pointer-events-none absolute top-20 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-purple-500/10 blur-[120px]" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* Title with gradient */}
        <h1 className="bg-linear-to-r from-white via-white to-white/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
          Cobalt Network
        </h1>

        {/* Tagline */}
        <p className="text-muted-foreground max-w-md text-lg sm:max-w-lg sm:text-xl">
          Your ultimate Discord companion for gaming, economy, and community
          engagement.
        </p>

        {/* CTA Buttons */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            size="lg"
            className="min-w-40"
            render={<Link href="/commands" />}
          >
            Explore Commands
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-40"
            render={
              <Link
                href="https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID"
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            Add to Discord
          </Button>
        </div>
      </div>
    </div>
  );
}
