"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { LEADERBOARD_CONFIG } from "~/lib/leaderboard-config";
import Leaderboard from "./_components/leaderboard";

export default function Page() {
  const [value, setValue] = useState<string | null>("level");

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 pb-3">
        <h2 className="scroll-m-20 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Global{" "}
          {LEADERBOARD_CONFIG.find((item) => item.value === value)?.label}{" "}
          Leaderboard
        </h2>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {LEADERBOARD_CONFIG.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        {value && <Leaderboard category={value} />}
      </div>
    </>
  );
}
