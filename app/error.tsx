"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-background text-foreground text-center px-16 py-32">
      <h2 className="text-2xl font-semibold">Something went wrong.</h2>
      <p className="text-foreground/70">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={() => retry()}
        className="bg-primary text-primary-foreground px-6 py-3 rounded-xl cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
