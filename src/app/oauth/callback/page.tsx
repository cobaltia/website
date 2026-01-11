"use client";
import { LoginData } from "@sapphire/plugin-api";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { FetchMethods, LocalStorageKeys } from "~/lib/constants";
import { apiFetch, saveState } from "~/lib/utils";

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();
  const hasExchangedRef = useRef(false);

  const exchangeMutation = useMutation({
    mutationFn: async (code: string) => {
      const data = await apiFetch<LoginData>("/oauth/callback", {
        method: FetchMethods.Post,
        body: JSON.stringify({ code }),
      });

      console.log("OAuth exchange data:", data);
      saveState(LocalStorageKeys.DiscordPack, data);
      saveState(LocalStorageKeys.LastSync, Date.now());
      return data;
    },
    onSuccess: async () => {
      router.replace("/");
    },
  });

  const code = params.get("code");

  useEffect(() => {
    if (!code) return;
    if (hasExchangedRef.current) return;
    hasExchangedRef.current = true;
    exchangeMutation.mutate(code);
  }, [code, exchangeMutation]);

  if (exchangeMutation.isPending) return <div>Exchanging code...</div>;

  if (exchangeMutation.isError)
    return <div>Error: {(exchangeMutation.error as Error).message}</div>;

  return <div>Finalizing...</div>;
}
