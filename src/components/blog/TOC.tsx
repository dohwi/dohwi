"use client";

import { cn } from "@/lib/utils";

import type { TOCItem } from "@/types/post";

interface TOCProps {
  items: TOCItem[];
}

export default function TOC({ items }: TOCProps) {
  if (items.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-20">
        <h3 className="text-sm font-semibold text-foreground mb-3">목차</h3>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToHeading(item.id)}
                className={cn(
                  "text-sm text-muted hover:text-foreground transition-colors text-left cursor-pointer",
                  item.level === 2 && "pl-0",
                  item.level === 3 && "pl-4"
                )}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
