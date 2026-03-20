import { Code2, Eye, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import type { TrackingCode } from "@/Pages/Dashboard/TrackingCodes/Hooks/useTrackingCodes";

type TrackingCodeCardProps = {
  trackingCode: TrackingCode;
  onPreview: (trackingCode: TrackingCode) => void;
  onEdit: (trackingCode: TrackingCode) => void;
  onDelete: (id: number) => void;
};

export default function TrackingCodeCard({
  trackingCode,
  onPreview,
  onEdit,
  onDelete,
}: TrackingCodeCardProps) {
  return (
    <Card className="rounded-xl border-border bg-background shadow-[0px_2px_4px_0px_hsla(0,0%,0%,0.05),0px_1px_2px_0px_hsla(0,0%,0%,0.06)]">
      <div className="flex items-center gap-4 p-4 sm:p-5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-border bg-muted/40">
          <Code2 className="size-5 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold">
            {trackingCode.name}
          </div>
          <div className="mt-1 truncate text-sm text-muted-foreground">
            {trackingCode.scriptCode}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            title="Preview"
            onClick={() => onPreview(trackingCode)}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Edit"
            onClick={() => onEdit(trackingCode)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon-sm"
            title="Delete"
            onClick={() => onDelete(trackingCode.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

