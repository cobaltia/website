"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import NetWorth from "./_components/networth";
import Wallet from "./_components/wallet";
import Bank from "./_components/bank";
import Level from "./_components/level";
import SocialCredit from "./_components/socialcredit";
import VCTime from "./_components/vctime";
import { LEADERBOARD_OPTIONS } from "~/lib/constants";

export default function Page() {
  const [value, setValue] = useState<string | null>("level");

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 pb-3">
        <h2 className="scroll-m-20 text-center text-3xl font-semibold tracking-tight first:mt-0">
          Global{" "}
          {LEADERBOARD_OPTIONS.find((item) => item.value === value)?.label}{" "}
          Leaderboard
        </h2>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {LEADERBOARD_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        {value === "wallet" && <Wallet />}
        {value === "bank" && <Bank />}
        {value === "net_worth" && <NetWorth />}
        {value === "level" && <Level />}
        {value === "social_credit" && <SocialCredit />}
        {value === "vc_time" && <VCTime />}
      </div>
    </>
  );
}
