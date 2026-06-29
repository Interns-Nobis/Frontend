import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { FileText, Upload } from "lucide-react";

export function DocumentCard({ name, file, uploaded }: { name: string; file: string; uploaded: boolean }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="font-medium truncate text-sm">{name}</div>
              <div className="text-xs text-muted-foreground truncate">{file || "Not uploaded"}</div>
            </div>
          </div>
          <StatusBadge status={uploaded ? "Approved" : "Pending"} />
        </div>
        <Button variant={uploaded ? "outline" : "default"} size="sm" className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          {uploaded ? "Replace File" : "Upload File"}
        </Button>
      </CardContent>
    </Card>
  );
}
