"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center opacity-50 cursor-not-allowed" disabled>
        <span className="sr-only">테마 로딩 중</span>
      </button>
    );
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    if (document.startViewTransition) {
      document.startViewTransition(() => setTheme(newTheme));
    } else {
      setTheme(newTheme);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="group relative w-10 h-10 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="테마 전환"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform group-hover:rotate-[45deg]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform group-hover:rotate-[45deg]" />
      )}
    </button>
  );
}
