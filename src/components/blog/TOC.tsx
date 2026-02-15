"use client";

import { cn } from "@/lib/utils";

import type { TOCItem } from "@/types/post";

interface TOCProps {
  items: TOCItem[];
}

export default function TOC({ items }: TOCProps) {
  if (items.length === 0) return null;

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-20">
        <h3 className="text-sm font-semibold text-foreground mb-3">목차</h3>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "text-sm text-muted hover:text-accent block scroll-mt-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded",
                  item.level === 2 && "pl-0",
                  item.level === 3 && "pl-4"
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
