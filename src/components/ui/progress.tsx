import { cn } from "@/lib/utils";

export function Progress({ value, className, label }: { value: number; className?: string; label?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {label ? <div className="flex justify-between text-sm font-semibold"><span>{label}</span><span>{value}%</span></div> : null}
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--blue-100)]" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-[var(--blue)] transition-[width] duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
