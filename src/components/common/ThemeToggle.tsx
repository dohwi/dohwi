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
      <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center opacity-50 cursor-not-allowed">
        <span className="sr-only">Loading theme</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="group relative w-10 h-10 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-500 group-hover:rotate-[45deg]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-500 group-hover:rotate-[45deg]" />
      )}
    </button>
  );
}
