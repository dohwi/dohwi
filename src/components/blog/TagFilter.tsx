"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

interface TagFilterProps {
  tags: string[];
  categories: string[];
}

export default function TagFilter({ tags, categories }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");
  const currentCategory = searchParams.get("category");

  const handleFilter = (type: "tag" | "category", value: string) => {
    const params = new URLSearchParams(searchParams);
    if (type === "tag") {
      if (currentTag === value) {
        params.delete("tag");
      } else {
        params.set("tag", value);
      }
    } else {
      if (currentCategory === value) {
        params.delete("category");
      } else {
        params.set("category", value);
      }
    }
    router.push(`/blog?${params.toString()}`);
  };

  if (categories.length === 0 && tags.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted">카테고리:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilter("category", category)}
              className={cn(
                "px-3 py-1 text-sm rounded-md border transition-colors duration-300",
                currentCategory === category
                  ? "bg-accent text-white border-accent"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted">태그:</span>
          {tags.slice(0, 10).map((tag) => (
            <button
              key={tag}
              onClick={() => handleFilter("tag", tag)}
              className={cn(
                "px-3 py-1 text-sm rounded-md border transition-colors duration-300",
                currentTag === tag
                  ? "bg-accent text-white border-accent"
                  : "border-border text-muted hover:border-accent hover:text-accent"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
