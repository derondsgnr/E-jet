 /**
 * ErrorState — Graceful error handling component.
 * Consistent error UX across all dashboards.
 */

import { AlertCircle } from "lucide-react";
import { Button } from "../ui/button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="mb-4 text-destructive opacity-80">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h3 className="text-foreground mb-1">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
