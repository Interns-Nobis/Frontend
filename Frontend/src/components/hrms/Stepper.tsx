import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step { id: number; title: string; short?: string }

export function Stepper({ steps, current, onJump }: { steps: Step[]; current: number; onJump?: (i: number) => void }) {
  return (
    <nav aria-label="Progress" className="space-y-1">
      {steps.map((s, i) => {
        const done = i < current; const active = i === current;
        const clickable = !!onJump && i <= current;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => clickable && onJump?.(i)}
            disabled={!clickable}
            className={cn(
              "w-full flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
              active ? "bg-primary/10 text-primary font-medium" : done ? "text-foreground hover:bg-muted" : "text-muted-foreground",
              clickable ? "cursor-pointer" : "cursor-default"
            )}
          >
            <span className={cn(
              "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0",
              done ? "bg-success text-success-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {done ? <Check className="h-3.5 w-3.5" /> : s.id}
            </span>
            <span className="truncate">{s.title}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function MobileStepProgress({ current, total, title }: { current: number; total: number; title: string }) {
  const pct = ((current + 1) / total) * 100;
  return (
    <div className="lg:hidden mb-4">
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-medium">Step {current + 1} of {total}</span>
        <span className="text-muted-foreground truncate ml-2">{title}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}