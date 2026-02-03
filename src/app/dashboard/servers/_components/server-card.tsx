import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { displayBannerURL, displayIconURL } from "~/lib/utils";
import Image from "next/image";
import { TransformedLoginData } from "~/types/apiData";
import { ValuesType } from "utility-types";
import { IconCrownFilled } from "@tabler/icons-react";
import Link from "next/link";

interface serverCardProps {
  server: ValuesType<TransformedLoginData["transformedGuilds"]>;
  user: TransformedLoginData["user"];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ServerCard({ server, user }: serverCardProps) {
  const iconURL = displayIconURL(server);
  const bannerURL = displayBannerURL(server);
  return (
    <Link href={`/dashboard/servers/${server.id}`} className="h-full">
      <Card className="h-full overflow-hidden pt-0">
        <div className="bg-muted relative h-20 w-full">
          {bannerURL && (
            <Image
              src={bannerURL}
              alt={`${server.name} banner`}
              fill
              className="object-cover object-center"
            />
          )}
        </div>
        <CardHeader className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={iconURL} />
            <AvatarFallback>{getInitials(server.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="line-clamp-2 flex items-center gap-1">
              <span>{server.name}</span>
              <span>
                {server.ownerId === user?.id && (
                  <IconCrownFilled className="size-4 text-yellow-500" />
                )}
              </span>
            </CardTitle>
            <CardDescription>
              {(server.approximateMemberCount ?? 0).toLocaleString()}{" "}
              {server.approximateMemberCount === 1 ? "member" : "members"}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
