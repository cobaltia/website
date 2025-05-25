// import { REST } from "@discordjs/rest";
// import { Routes } from "discord-api-types/v10";
// import { env } from "~/env";

// const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);

// const userCache = new Map<string, unknown>();

// export async function getUsers(users: string[]) {
//   let users = [];
//   for (const user of users) {
//     if (userCache.has(user)) {
//       users.push(userCache.get(user)!);
//     } else {
//       const userData = await rest.get(Routes.user(user));
//       if (userData) {
//         userCache.set(user, userData);
//         users.push(userData);
//       }
//     }
//   }
//   return users;
// }
