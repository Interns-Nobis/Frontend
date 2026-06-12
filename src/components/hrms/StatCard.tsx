import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  delta?: number;
  hint?: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "danger" | "info";
}

const tones: Record<NonNullable<Props["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-info/15 text-info",
};

export function StatCard({ label, value, delta, hint, icon: Icon, tone = "primary" }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="border-border/60 shadow-sm hover:shadow-elevated transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">{label}</div>
              <div className="mt-1.5 text-2xl font-semibold tabular-nums">{value}</div>
              {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
            </div>
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", tones[tone])}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          {typeof delta === "number" && (
            <div className={cn("mt-3 inline-flex items-center gap-1 text-xs font-medium", delta >= 0 ? "text-success" : "text-destructive")}>
              {delta >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {Math.abs(delta)}% vs last month
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}