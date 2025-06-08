import { env } from "~/env";
import { type Command } from "~/lib/types";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const commandRouter = createTRPCRouter({
  getCommands: publicProcedure.query(async () => {
    const commandsResult = await fetch(`${env.BASE_URL}/api/commands`);
    const commands = (await commandsResult.json()) as Command[];

    const categories = Array.from(
      new Set(commands.map((command) => command.category)),
    ).sort();

    return categories.map((category) => ({
      name: category,
      commands: commands.filter((command) => command.category === category),
    }));
  }),
});
