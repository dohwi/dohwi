"use client";

import { useSearchParams, useRouter } from "next/navigation";

interface SearchBarProps {
  placeholder?: string;
}

export default function SearchBar({ placeholder = "Search posts..." }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("q") || "";

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={currentSearch}
        onChange={(e) => {
          const value = e.target.value;
          const params = new URLSearchParams(searchParams);
          if (value) {
            params.set("q", value);
          } else {
            params.delete("q");
          }
          router.push(`/blog?${params.toString()}`);
        }}
        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
      />
    </div>
  );
}
