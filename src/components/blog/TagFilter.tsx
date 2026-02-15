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
    const currentValue = type === "tag" ? currentTag : currentCategory;

    if (currentValue === value) {
      params.delete(type);
    } else {
      params.set(type, value);
    }
    router.push(`/blog?${params.toString()}`);
  };

  if (categories.length === 0 && tags.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <FilterGroup
        label="카테고리"
        items={categories}
        selectedItem={currentCategory}
        onSelect={(value) => handleFilter("category", value)}
      />
      <FilterGroup
        label="태그"
        items={tags.slice(0, 10)}
        selectedItem={currentTag}
        onSelect={(value) => handleFilter("tag", value)}
        prefix="#"
      />
    </div>
  );
}

interface FilterGroupProps {
  label: string;
  items: string[];
  selectedItem: string | null;
  onSelect: (value: string) => void;
  prefix?: string;
}

function FilterGroup({ label, items, selectedItem, onSelect, prefix = "" }: FilterGroupProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted">{label}:</span>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={cn(
            "px-3 py-1 text-sm rounded-md border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            selectedItem === item
              ? "bg-accent text-white border-accent"
              : "border-border text-muted hover:border-accent hover:text-accent"
          )}
        >
          {prefix}{item}
        </button>
      ))}
    </div>
  );
}
