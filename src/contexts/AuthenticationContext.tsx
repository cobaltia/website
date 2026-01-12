"use client";
import { LoginData } from "@sapphire/plugin-api";
import constate from "constate";
import { useState } from "react";
import { LocalStorageKeys } from "~/lib/constants";
import { loadState } from "~/lib/utils";

const discordPack = loadState<LoginData>(LocalStorageKeys.DiscordPack);

const useAuthenticationState = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(
    Boolean(discordPack) && Boolean(discordPack?.user),
  );

  return { authenticated, setAuthenticated };
};

export const [AuthenticatedProvider, useAuthenticated, setAuthenticated] =
  constate(
    useAuthenticationState,
    (value) => value.authenticated,
    (value) => value.setAuthenticated,
  );

export default AuthenticatedProvider;
