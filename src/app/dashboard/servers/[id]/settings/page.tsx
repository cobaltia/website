"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { ChannelType } from "discord-api-types/v10";
import { useDiscordPack } from "~/contexts/DiscordPackContext";
import { useAuthenticated } from "~/contexts/AuthenticationContext";
import {
  useServerSettings,
  useUpdateServerSettings,
} from "~/hooks/use-server-settings";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FieldError } from "~/components/ui/field";
import { Spinner } from "~/components/ui/spinner";
import { toast } from "sonner";

const formSchema = z.object({
  logChannelId: z.string().nullable(),
  welcomeChannelId: z.string().nullable(),
  voiceChannelId: z.string().nullable(),
  welcomeMessage: z
    .string()
    .max(500, "Welcome message must be at most 500 characters."),
});

type ChannelOption = {
  id: string;
  name: string;
  label: string;
};

export default function Page() {
  const params = useParams<{ id: string }>();
  const authenticated = useAuthenticated();
  const pack = useDiscordPack();
  const { data: settings, isLoading } = useServerSettings(params.id, {
    enabled: authenticated,
  });
  const { mutate, isPending } = useUpdateServerSettings(params.id);

  const server = pack.transformedGuilds?.find((g) => g.id === params.id);

  const textChannelOptions: ChannelOption[] =
    server?.channels
      .filter((c) => c.type === ChannelType.GuildText)
      .map((c) => ({ id: c.id, name: c.name, label: `#${c.name}` })) ?? [];

  const form = useForm({
    defaultValues: {
      logChannelId: null as string | null,
      welcomeChannelId: null as string | null,
      voiceChannelId: null as string | null,
      welcomeMessage: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(
        {
          logChannelId: value.logChannelId,
          welcomeChannelId: value.welcomeChannelId,
          voiceChannelId: value.voiceChannelId,
          welcomeMessage: value.welcomeMessage || undefined,
        },
        {
          onSuccess: () => toast.success("Settings saved successfully."),
          onError: () => toast.error("Failed to save settings."),
        },
      );
    },
  });

  useEffect(() => {
    if (settings) {
      form.setFieldValue("logChannelId", settings.logChannelId);
      form.setFieldValue("welcomeChannelId", settings.welcomeChannelId);
      form.setFieldValue("voiceChannelId", settings.voiceChannelId);
      form.setFieldValue("welcomeMessage", settings.welcomeMessage ?? "");
    }
  }, [settings, form]);

  if (!authenticated) return <div>Please log in to view this server.</div>;
  if (!server) return <div>Server not found.</div>;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">{server.name} Settings</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-4">
          <form.Field
            name="logChannelId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const selectedChannel = field.state.value
                ? textChannelOptions.find((c) => c.id === field.state.value)
                : null;
              return (
                <Card
                  size="sm"
                  className="flex flex-col sm:flex-row sm:items-center"
                >
                  <CardHeader className="flex-1">
                    <CardTitle>Log Channel</CardTitle>
                    <CardDescription>
                      Channel where Cobaltia will send log messages.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="w-full sm:w-84 sm:shrink-0">
                    <Combobox
                      items={textChannelOptions}
                      itemToStringValue={(channel) => channel.name}
                      itemToStringLabel={(channel) => channel.label}
                      value={selectedChannel ?? null}
                      onValueChange={(channel) =>
                        field.handleChange(channel?.id ?? null)
                      }
                    >
                      <ComboboxInput
                        id={field.name}
                        placeholder="Search channels..."
                        aria-invalid={isInvalid}
                        showClear={!!field.state.value}
                        className="w-full"
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No channels found.</ComboboxEmpty>
                        <ComboboxList>
                          {(channel) => (
                            <ComboboxItem key={channel.id} value={channel}>
                              {channel.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </CardContent>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Card>
              );
            }}
          />

          <form.Field
            name="welcomeChannelId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const selectedChannel = field.state.value
                ? textChannelOptions.find((c) => c.id === field.state.value)
                : null;
              return (
                <Card
                  size="sm"
                  className="flex flex-col sm:flex-row sm:items-center"
                >
                  <CardHeader className="flex-1">
                    <CardTitle>Welcome Channel</CardTitle>
                    <CardDescription>
                      Channel where Cobaltia will send welcome messages.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="w-full sm:w-84 sm:shrink-0">
                    <Combobox
                      items={textChannelOptions}
                      itemToStringValue={(channel) => channel.name}
                      itemToStringLabel={(channel) => channel.label}
                      value={selectedChannel ?? null}
                      onValueChange={(channel) =>
                        field.handleChange(channel?.id ?? null)
                      }
                    >
                      <ComboboxInput
                        id={field.name}
                        placeholder="Search channels..."
                        aria-invalid={isInvalid}
                        showClear={!!field.state.value}
                        className="w-full"
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No channels found.</ComboboxEmpty>
                        <ComboboxList>
                          {(channel) => (
                            <ComboboxItem key={channel.id} value={channel}>
                              {channel.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </CardContent>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Card>
              );
            }}
          />

          <form.Field
            name="voiceChannelId"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const selectedChannel = field.state.value
                ? textChannelOptions.find((c) => c.id === field.state.value)
                : null;
              return (
                <Card
                  size="sm"
                  className="flex flex-col sm:flex-row sm:items-center"
                >
                  <CardHeader className="flex-1">
                    <CardTitle>Voice Log Channel</CardTitle>
                    <CardDescription>
                      Channel where voice session summaries will be sent.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="w-full sm:w-84 sm:shrink-0">
                    <Combobox
                      items={textChannelOptions}
                      itemToStringValue={(channel) => channel.name}
                      itemToStringLabel={(channel) => channel.label}
                      value={selectedChannel ?? null}
                      onValueChange={(channel) =>
                        field.handleChange(channel?.id ?? null)
                      }
                    >
                      <ComboboxInput
                        id={field.name}
                        placeholder="Search channels..."
                        aria-invalid={isInvalid}
                        showClear={!!field.state.value}
                        className="w-full"
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>No channels found.</ComboboxEmpty>
                        <ComboboxList>
                          {(channel) => (
                            <ComboboxItem key={channel.id} value={channel}>
                              {channel.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </CardContent>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Card>
              );
            }}
          />

          <form.Field
            name="welcomeMessage"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Card
                  size="sm"
                  className="flex flex-col sm:flex-row sm:items-start"
                >
                  <CardHeader className="flex-1">
                    <CardTitle>Welcome Message</CardTitle>
                    <CardDescription>
                      Use {"{guild}"} for server name and {"{user}"} for the
                      member mention.
                    </CardDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </CardHeader>
                  <CardContent className="w-full sm:w-84 sm:shrink-0">
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Welcome to {guild}, {user}!"
                      className="min-h-24"
                    />
                  </CardContent>
                </Card>
              );
            }}
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
