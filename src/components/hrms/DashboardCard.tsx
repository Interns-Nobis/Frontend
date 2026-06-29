import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function DashboardCard({
  label, value, icon: Icon, accent = "text-primary bg-primary/10", hint,
}: {
  label: string; value: string | number; icon: LucideIcon; accent?: string; hint?: string;
}) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={cn("p-3 rounded-xl", accent)}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-muted-foreground truncate">{label}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
