import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDB, markNotificationRead, markAllRead } from "@/data/store";
import { cn } from "@/lib/utils";

const typeStyles = {
  info: "bg-info/15 text-info",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  error: "bg-destructive/15 text-destructive",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); return `${d}d ago`;
}

export function NotificationCenter() {
  const notifications = useDB((d) => d.notifications);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full" aria-label="Notifications">
          <Bell className="h-[1.15rem] w-[1.15rem]" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <div className="font-semibold">Notifications</div>
            <div className="text-xs text-muted-foreground">{unread} unread</div>
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <Check className="h-3.5 w-3.5 mr-1" />Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications</div>
          ) : notifications.slice(0, 10).map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                "w-full text-left block px-4 py-3 border-b last:border-0 hover:bg-muted/50 transition-colors",
                !n.read && "bg-primary/5"
              )}
            >
              <div className="flex gap-3">
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5", typeStyles[n.type])}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-medium text-sm truncate">{n.title}</div>
                    {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{n.body}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}