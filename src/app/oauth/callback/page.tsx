"use client";
import { LoginData } from "@sapphire/plugin-api";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { setAuthenticated } from "~/contexts/AuthenticationContext";
import { mergeDiscordPack } from "~/contexts/DiscordPackContext";
import { FetchMethods, LocalStorageKeys } from "~/lib/constants";
import { apiFetch, saveState } from "~/lib/utils";

export default function Page() {
  const params = useSearchParams();
  const router = useRouter();
  const hasExchangedRef = useRef(false);
  const writeAuthenticated = setAuthenticated();
  const mergePack = mergeDiscordPack();

  const exchangeMutation = useMutation({
    mutationFn: async (code: string) => {
      const data = await apiFetch<LoginData>("/oauth/callback", {
        method: FetchMethods.Post,
        body: JSON.stringify({ code }),
      });

      console.log("OAuth exchange data:", data);
      saveState(LocalStorageKeys.DiscordPack, data);
      saveState(LocalStorageKeys.LastSync, Date.now());
      writeAuthenticated(true);
      mergePack(data);

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

  if (exchangeMutation.isPending)
    return (
      <>
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="mr-2" />
          Signing In
        </div>
      </>
    );

  if (exchangeMutation.isError)
    return (
      <>
        <div className="flex min-h-screen flex-col items-center justify-center gap-2">
          <span>Error: failed to sign in</span>
          <Button onClick={() => window.history.back()}>Back</Button>
        </div>
      </>
    );

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="mr-2" />
        Loading
      </div>
    </>
  );
}
