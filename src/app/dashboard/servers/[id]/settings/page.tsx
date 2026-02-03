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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
import { Spinner } from "~/components/ui/spinner";

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
      mutate({
        logChannelId: value.logChannelId,
        welcomeChannelId: value.welcomeChannelId,
        voiceChannelId: value.voiceChannelId,
        welcomeMessage: value.welcomeMessage || undefined,
      });
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
        <Card>
          <CardHeader>
            <CardTitle>Channel Configuration</CardTitle>
            <CardDescription>
              Configure which channels Cobaltia should use for various features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <form.Field
                name="logChannelId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  const selectedChannel = field.state.value
                    ? textChannelOptions.find((c) => c.id === field.state.value)
                    : null;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Log Channel</FieldLabel>
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
                      <FieldDescription>
                        Channel where Cobaltia will send log messages.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
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
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Welcome Channel
                      </FieldLabel>
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
                      <FieldDescription>
                        Channel where Cobaltia will send welcome messages.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
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
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Voice Log Channel
                      </FieldLabel>
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
                      <FieldDescription>
                        Channel where voice session summaries will be sent.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="welcomeMessage"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Welcome Message
                      </FieldLabel>
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
                      <FieldDescription>
                        Use {"{guild}"} for server name and {"{user}"} for the
                        member mention.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
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
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
