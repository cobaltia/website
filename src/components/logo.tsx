import Image from "next/image";
import { cn } from "~/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 96 }: LogoProps) {
  return (
    <Image
      src="/Cobalt_Seal1.png"
      alt="Cobalt Network Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  );
}

export function LogoMark({ className, size = 24 }: LogoProps) {
  return (
    <Image
      src="/Cobalt_Seal1.png"
      alt="Cobalt Network"
      width={size}
      height={size}
      className={cn("size-6", className)}
      priority
    />
  );
}
