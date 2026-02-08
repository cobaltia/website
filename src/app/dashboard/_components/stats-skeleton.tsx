import { Card, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card size="sm" key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-28" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
