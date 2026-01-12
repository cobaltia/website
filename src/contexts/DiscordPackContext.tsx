"use client";
import { LoginData } from "@sapphire/plugin-api";
import constate from "constate";
import { useCallback, useState } from "react";
import { LocalStorageKeys } from "~/lib/constants";
import { loadState } from "~/lib/utils";
import { mergeDefault } from "@sapphire/utilities";

const discordPack = loadState<LoginData>(LocalStorageKeys.DiscordPack);

const useDiscordPackState = () => {
  const [pack, setPack] = useState<LoginData>(discordPack ?? { user: null });

  const mergePack = useCallback(
    (newPack: Partial<LoginData>) => setPack(mergeDefault(pack, newPack)),
    [pack],
  );

  return { pack, mergePack };
};

export const [DiscordPackProvider, useDiscordPack, mergeDiscordPack] = constate(
  useDiscordPackState,
  (value) => value.pack,
  (value) => value.mergePack,
);

export default DiscordPackProvider;
