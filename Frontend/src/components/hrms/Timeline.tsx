import { Check, Circle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineStep { label: string; state: "done" | "current" | "pending" | "rejected" }

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative border-l-2 border-border ml-4 space-y-6 py-2">
      {steps.map((s, i) => (
        <li key={i} className="ml-6 relative">
          <span
            className={cn(
              "absolute -left-9 top-0 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-background",
              s.state === "done" && "bg-emerald-500 text-white",
              s.state === "current" && "bg-primary text-primary-foreground animate-pulse",
              s.state === "pending" && "bg-muted text-muted-foreground",
              s.state === "rejected" && "bg-destructive text-destructive-foreground",
            )}
          >
            {s.state === "done" ? <Check className="h-3 w-3" /> :
             s.state === "rejected" ? <X className="h-3 w-3" /> :
             <Circle className="h-2 w-2 fill-current" />}
          </span>
          <h3 className={cn("font-medium", s.state === "pending" ? "text-muted-foreground" : "text-foreground")}>
            {s.label}
          </h3>
        </li>
      ))}
    </ol>
  );
}
