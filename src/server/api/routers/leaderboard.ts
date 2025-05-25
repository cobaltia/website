import { getGlobalUserNetworthLeaderboard } from "@prisma/client/sql";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const leaderboardRouter = createTRPCRouter({
  getGlobalNetworth: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.$queryRawTyped(
        getGlobalUserNetworthLeaderboard(input.limit, input.offset),
      );

      const userIds = result.map((user) => user.id);
      const usersResult = await fetch(
        `${env.BASE_URL}/api/users/getUserList?users=${userIds.join(",")}`,
      );
      const users = (await usersResult.json()) as {
        id: string;
        username: string;
        displayName: string;
        discriminator: string;
        avatar: string | null;
      }[];

      return result.map((user) => ({
        id: user.id,
        username: users.find((u) => u.id === user.id)?.username,
        displayName: users.find((u) => u.id === user.id)?.displayName,
        discriminator: users.find((u) => u.id === user.id)?.discriminator,
        avatar: users.find((u) => u.id === user.id)?.avatar,
        networth: `₡${user.net_worth?.toLocaleString("en-US")}`,
      }));
    }),
});
