import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 pt-3 sm:pb-3">
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Home Dashboard
        </h2>
      </div>
      <div className="mt-4 mr-3 ml-3 sm:mt-0 sm:mr-4 sm:ml-4 sm:flex sm:gap-4">
        <Card className="w-full sm:w-1/2">
          <CardHeader>
            <CardTitle>Server Dashboard</CardTitle>
            <CardDescription>Manage your server settings</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full"
              nativeButton={false}
              render={<Link href="/dashboard/servers">View Servers</Link>}
            />
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
