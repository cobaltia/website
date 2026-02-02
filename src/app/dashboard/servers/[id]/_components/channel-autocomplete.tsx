"use client";

import { IconHash, IconVolume } from "@tabler/icons-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "~/components/ui/combobox";

interface Channel {
  id: string;
  name: string;
  type: number;
}

interface ChannelOption {
  value: string;
  label: string;
}

interface ChannelAutocompleteProps {
  channels: Channel[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  isVoice?: boolean;
  className?: string;
}

export function ChannelAutocomplete({
  channels,
  value,
  onChange,
  placeholder = "Search channels...",
  isVoice = false,
  className,
}: ChannelAutocompleteProps) {
  // Convert channels to value/label format
  const channelOptions: ChannelOption[] = [
    { value: "", label: "None" },
    ...channels.map((c) => ({ value: c.id, label: c.name })),
  ];

  const handleValueChange = (newValue: ChannelOption | null) => {
    onChange(newValue?.value === "" ? null : (newValue?.value ?? null));
  };

  // Find the current selected option
  const selectedOption =
    channelOptions.find((opt) => opt.value === (value ?? "")) ?? null;

  const Icon = isVoice ? IconVolume : IconHash;

  return (
    <Combobox
      items={channelOptions}
      value={selectedOption}
      onValueChange={handleValueChange}
      itemToStringValue={(option: ChannelOption) => option.label}
    >
      <ComboboxInput
        placeholder={placeholder}
        className={className ?? "w-72"}
        showClear={!!value}
      />
      <ComboboxContent>
        <ComboboxEmpty>No channels found.</ComboboxEmpty>
        <ComboboxList>
          {(option: ChannelOption) => (
            <ComboboxItem key={option.value || "none"} value={option}>
              {option.value ? (
                <>
                  <Icon className="text-muted-foreground size-4" />
                  <span>{option.label}</span>
                </>
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
