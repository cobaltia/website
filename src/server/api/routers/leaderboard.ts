import {
  getGlobalUserNetworthLeaderboard,
  getGlobalUserVcTimeLeaderboard,
} from "@prisma/client/sql";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const leaderboardRouter = createTRPCRouter({
  getGlobalUserWallet: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.user.findMany({
        orderBy: { wallet: "desc" },
        take: input.limit,
        skip: input.offset,
      });

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
        wallet: `₡${user.wallet.toLocaleString("en-US")}`,
      }));
    }),
  getGlobalUserBank: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.user.findMany({
        orderBy: { bankBalance: "desc" },
        take: input.limit,
        skip: input.offset,
      });

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
        bankBalance: `₡${user.bankBalance.toLocaleString("en-US")}`,
      }));
    }),
  getGlobalUserLevel: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.user.findMany({
        orderBy: { level: "desc" },
        take: input.limit,
        skip: input.offset,
      });

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
        level: user.level,
      }));
    }),
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
  getGlobalUserSocialCredit: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.user.findMany({
        orderBy: { socialCredit: "desc" },
        take: input.limit,
        skip: input.offset,
      });

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
        socialCredit: user.socialCredit.toLocaleString("en-US"),
      }));
    }),
  getGlobalUserVcTime: publicProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.$queryRawTyped(
        getGlobalUserVcTimeLeaderboard(input.limit, input.offset),
      );

      const userIds = result.map((user) => user.user_id);
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
        id: user.user_id,
        username: users.find((u) => u.id === user.user_id)?.username,
        displayName: users.find((u) => u.id === user.user_id)?.displayName,
        discriminator: users.find((u) => u.id === user.user_id)?.discriminator,
        avatar: users.find((u) => u.id === user.user_id)?.avatar,
        total_duration: user.total_duration,
      }));
    }),
});
