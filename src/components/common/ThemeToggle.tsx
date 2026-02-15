"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/hooks/useHydrated";

interface ThemeToggleProps {
  variant?: "default" | "ghost";
  className?: string;
}

export default function ThemeToggle({ 
  variant = "default", 
  className 
}: ThemeToggleProps) {
  const mounted = useHydrated();
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <button 
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center opacity-50 cursor-not-allowed",
          variant === "ghost" && "bg-transparent",
          variant === "default" && "bg-secondary"
        )}
        disabled
      >
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

  const buttonStyles = cn(
    "flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    variant === "default" && "w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 hover:scale-110",
    variant === "ghost" && "p-2 rounded-md text-muted hover:text-foreground hover:bg-border/50",
    className
  );

  return (
    <button
      onClick={toggleTheme}
      className={buttonStyles}
      aria-label="테마 전환"
    >
      {resolvedTheme === "dark" ? (
        <Sun 
          className={cn(
            "h-[1.2rem] w-[1.2rem] transition-transform",
            variant === "default" && "group-hover:rotate-[45deg]",
            variant === "ghost" && "w-5 h-5"
          )} 
        />
      ) : (
        <Moon 
          className={cn(
            "h-[1.2rem] w-[1.2rem] transition-transform",
            variant === "default" && "group-hover:rotate-[45deg]",
            variant === "ghost" && "w-5 h-5"
          )} 
        />
      )}
    </button>
  );
}
