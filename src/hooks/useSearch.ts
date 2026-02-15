"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { PostMeta } from "@/types/post";

interface UseSearchOptions {
  posts: PostMeta[];
  isOpen: boolean;
  onClose: () => void;
  maxResults?: number;
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  filteredPosts: PostMeta[];
  allTags: string[];
  allCategories: string[];
  hasActiveFilter: boolean;
  handleEnter: () => void;
  reset: () => void;
}

export function useSearch({
  posts,
  isOpen,
  onClose,
  maxResults = 5,
}: UseSearchOptions): UseSearchReturn {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts?.forEach((post) => post.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [posts]);

  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    posts?.forEach((post) => categorySet.add(post.category));
    return Array.from(categorySet).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let results = [...posts];

    if (selectedCategory) {
      results = results.filter((post) => post.category === selectedCategory);
    }

    if (selectedTag) {
      results = results.filter((post) => post.tags?.includes(selectedTag));
    }

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(lowerQuery);
        const descMatch = post.description?.toLowerCase().includes(lowerQuery);
        const tagsMatch = post.tags?.some((tag) =>
          tag.toLowerCase().includes(lowerQuery)
        );
        return titleMatch || descMatch || tagsMatch;
      });
    }

    if (!query.trim() && !selectedTag && !selectedCategory) return [];

    return results.slice(0, maxResults);
  }, [query, posts, selectedTag, selectedCategory, maxResults]);

  const hasActiveFilter = !!selectedTag || !!selectedCategory;

  const handleEnter = useCallback(() => {
    if (selectedIndex >= 0 && filteredPosts[selectedIndex]) {
      router.push(`/blog/${filteredPosts[selectedIndex].slug}`);
      onClose();
    } else if (query || selectedTag || selectedCategory) {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (selectedTag) params.set("tag", selectedTag);
      if (selectedCategory) params.set("category", selectedCategory);
      router.push(`/blog?${params.toString()}`);
      onClose();
    }
  }, [selectedIndex, filteredPosts, query, selectedTag, selectedCategory, router, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredPosts.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, filteredPosts, handleEnter]);

  const handleSetQuery = (newQuery: string) => {
    setQuery(newQuery);
    setSelectedIndex(-1);
  };

  const handleSetSelectedTag = (tag: string | null) => {
    setSelectedTag(tag);
    setSelectedIndex(-1);
  };

  const handleSetSelectedCategory = (category: string | null) => {
    setSelectedCategory(category);
    setSelectedIndex(-1);
  };

  const reset = useCallback(() => {
    setQuery("");
    setSelectedIndex(-1);
    setSelectedTag(null);
    setSelectedCategory(null);
  }, []);

  return {
    query,
    setQuery: handleSetQuery,
    selectedTag,
    setSelectedTag: handleSetSelectedTag,
    selectedCategory,
    setSelectedCategory: handleSetSelectedCategory,
    selectedIndex,
    setSelectedIndex,
    filteredPosts,
    allTags,
    allCategories,
    hasActiveFilter,
    handleEnter,
    reset,
  };
}
