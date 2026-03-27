 /**
 * LoadingState — Consistent loading patterns across the platform.
 * Skeleton-first approach (Linear/Vercel style) over spinners.
 */

interface LoadingStateProps {
  /** Number of skeleton rows to show */
  rows?: number;
  /** Visual variant */
  variant?: "card" | "list" | "page";
  className?: string;
}

export function LoadingState({
  rows = 3,
  variant = "list",
  className = "",
}: LoadingStateProps) {
  if (variant === "card") {
    return (
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-card p-5 space-y-3 animate-pulse"
          >
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-4/5 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className={`space-y-6 animate-pulse ${className}`}>
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-4 w-96 rounded bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-5 space-y-2">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-6 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: list
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg"
        >
          <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-muted" />
            <div className="h-3 w-2/3 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
