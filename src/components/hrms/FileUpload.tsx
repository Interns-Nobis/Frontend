import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, FileText, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
  value?: { name: string; size: number; type: string; dataUrl?: string } | null;
  onChange: (file: { name: string; size: number; type: string; dataUrl?: string } | null) => void;
  hint?: string;
}

export function FileUpload({ label, required, accept = ".pdf,.jpg,.jpeg,.png", maxSizeMB = 5, value, onChange, hint }: Props) {
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    setError(null);
    const f = files?.[0]; if (!f) return;
    if (f.size > maxSizeMB * 1024 * 1024) { setError(`File exceeds ${maxSizeMB}MB`); return; }
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => onChange({ name: f.name, size: f.size, type: f.type, dataUrl: String(reader.result) });
      reader.readAsDataURL(f);
    } else {
      onChange({ name: f.name, size: f.size, type: f.type });
    }
  }

  function onDrop(e: DragEvent) { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }

  const isImage = value?.type?.startsWith("image/");

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium flex items-center gap-1">
        {label}{required && <span className="text-destructive">*</span>}
      </label>

      {value ? (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
          {isImage && value.dataUrl ? (
            <img src={value.dataUrl} alt={value.name} className="h-12 w-12 rounded object-cover border" />
          ) : (
            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
              {isImage ? <ImageIcon className="h-5 w-5 text-muted-foreground" /> : <FileText className="h-5 w-5 text-muted-foreground" />}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
              <div className="text-sm font-medium truncate">{value.name}</div>
            </div>
            <div className="text-xs text-muted-foreground">{(value.size / 1024).toFixed(0)} KB</div>
          </div>
          <div className="flex gap-1">
            <Button type="button" size="sm" variant="outline" onClick={() => ref.current?.click()}>Replace</Button>
            <Button type="button" size="icon" variant="ghost" onClick={() => onChange(null)} aria-label="Remove file">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => ref.current?.click()}
          className={cn(
            "rounded-lg border-2 border-dashed p-5 text-center cursor-pointer transition-colors",
            drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
          )}
        >
          <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
          <div className="mt-2 text-sm font-medium">Drop file or click to upload</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {accept.split(",").map((s) => s.trim().toUpperCase().replace(".", "")).join(", ")} · max {maxSizeMB}MB
          </div>
        </div>
      )}

      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)} />

      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}