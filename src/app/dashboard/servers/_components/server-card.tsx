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
    <>
      <Card>
        <CardHeader className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={iconURL} />
            <AvatarFallback>{getInitials(server.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="flex items-center gap-1">
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
    </>
  );
}
