import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
}

export function KpiCard({ title, value, change, icon: Icon }: KpiCardProps) {
  return (
    <div className="rounded-lg bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground" style={{ strokeWidth: 1.5 }} />
      </div>
      <div className="mt-2 flex items-end gap-2">
        <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
        {change && (
          <span className="text-xs font-medium text-success-foreground bg-success-muted px-1.5 py-0.5 rounded mb-0.5">
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
