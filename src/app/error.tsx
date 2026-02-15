"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-6xl font-bold text-foreground">오류 발생</h1>
      <p className="text-xl text-muted">문제가 발생했습니다</p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-accent text-white rounded-full font-medium transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        다시 시도하기
      </button>
    </div>
  );
}
