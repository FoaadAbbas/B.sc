import type { ReactNode } from "react";

export function Card({
  title,
  subtitle,
  right,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "rounded-2xl border border-zinc-900 bg-zinc-950",
        "shadow-sm shadow-black/30",
        className,
      ].join(" ")}
    >
      {(title || subtitle || right) && (
        <div className="px-4 py-3 border-b border-zinc-900 flex items-start justify-between gap-3">
          <div>
            {title && <div className="font-semibold">{title}</div>}
            {subtitle && <div className="text-sm text-zinc-400">{subtitle}</div>}
          </div>
          {right}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
