import type { RESTGetAPICurrentUserResult } from "discord-api-types/v10";

export function displayAvatarURL(
  user: RESTGetAPICurrentUserResult | null | undefined,
  { format = "default", size = 256 } = {},
) {
  if (!user)
    return `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 4) + 1}.png`;
  if (user.avatar === null)
    return `https://cdn.discordapp.com/embed/avatars/${user.discriminator}.png`;
  if (format === "default")
    format = user.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${format}${`?size=${size}`}`;
}
