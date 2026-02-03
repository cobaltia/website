"use client";
import constate from "constate";
import { useCallback, useState } from "react";
import { LocalStorageKeys } from "~/lib/constants";
import { loadState } from "~/lib/utils";
import { mergeDefault } from "@sapphire/utilities";
import { TransformedLoginData } from "~/types/apiData";

const discordPack = loadState<TransformedLoginData>(
  LocalStorageKeys.DiscordPack,
);

const useDiscordPackState = () => {
  const [pack, setPack] = useState<TransformedLoginData>(
    discordPack ?? ({ user: null } as TransformedLoginData),
  );

  const mergePack = useCallback(
    (newPack: Partial<TransformedLoginData>) =>
      setPack(mergeDefault(pack, newPack)),
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
