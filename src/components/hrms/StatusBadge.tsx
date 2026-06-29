import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground border-border",
  Submitted: "bg-info/15 text-info border-info/30",
  "Under Review": "bg-warning/25 text-warning-foreground border-warning/40",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
  "Correction Requested": "bg-warning/25 text-warning-foreground border-warning/40",
  "HR Manager Approved": "bg-primary/15 text-primary border-primary/30",
  "HoD Approved": "bg-primary/20 text-primary border-primary/40",
  "Offer Released": "bg-success/15 text-success border-success/30",
  Approved: "bg-success/15 text-success border-success/30",
  Pending: "bg-warning/25 text-warning-foreground border-warning/40",
  Cancelled: "bg-muted text-muted-foreground border-border",
  Present: "bg-success/15 text-success border-success/30",
  Absent: "bg-destructive/15 text-destructive border-destructive/30",
  Leave: "bg-info/15 text-info border-info/30",
  WFH: "bg-primary/10 text-primary border-primary/30",
  Holiday: "bg-muted text-muted-foreground border-border",
  Active: "bg-success/15 text-success border-success/30",
  "On Leave": "bg-info/15 text-info border-info/30",
  Disabled: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium whitespace-nowrap", map[status] ?? "bg-muted text-muted-foreground")}>
      {status}
    </Badge>
  );
}
