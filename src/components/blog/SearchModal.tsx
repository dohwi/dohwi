"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { PostMeta } from "@/types/post";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PostMeta[];
}

export default function SearchModal({ isOpen, onClose, posts }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique tags and categories from posts
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

  // Handle mount/unmount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
      // Reset state when opening
      setQuery("");
      setSelectedIndex(-1);
      setSelectedTag(null);
      setSelectedCategory(null);
      
      // Trigger animation after mount
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setIsVisible(false), 400);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Filter posts based on query, tag, and category
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    let results = [...posts];

    // Apply category filter
    if (selectedCategory) {
      results = results.filter((post) => post.category === selectedCategory);
    }

    // Apply tag filter
    if (selectedTag) {
      results = results.filter((post) => post.tags?.includes(selectedTag));
    }

    // Apply text search
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(lowerQuery);
        const descMatch = post.description?.toLowerCase().includes(lowerQuery);
        const tagsMatch = post.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));
        return titleMatch || descMatch || tagsMatch;
      });
    }

    // Only show results if there's a query or filter applied
    if (!query.trim() && !selectedTag && !selectedCategory) return [];

    return results.slice(0, 5);
  }, [query, posts, selectedTag, selectedCategory]);

  // Handle keyboard navigation
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, query, filteredPosts, selectedIndex, router, selectedTag, selectedCategory]);

  if (!mounted || (!isOpen && !isVisible)) return null;

  const hasActiveFilter = !!selectedTag || !!selectedCategory;

  return createPortal(
    <div 
      className={`fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 transition-all duration-300 ease-in-out ${
        animate ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-0"
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/40"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-2xl bg-background border border-border rounded-xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] transform ${
          animate ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-8"
        }`}
      >
        <div className="flex items-center px-4 border-b border-border">
          <svg
            className="w-5 h-5 text-muted shrink-0"
            xmlns="http://www.w3.org/2000/svg"
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
            className="flex-1 h-14 px-3 bg-transparent text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent text-lg"
            placeholder="검색어를 입력하세요…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            autoFocus
          />
          <button 
            onClick={onClose}
            className="text-sm text-muted hover:text-foreground px-2 py-1 rounded transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            ESC
          </button>
        </div>

        {/* Tag & Category Filters */}
        <div className="flex border-b border-border">
          {/* Left Column: Titles */}
          <div className="flex flex-col border-r border-border">
            {allCategories.length > 0 && (
              <div className="flex items-center justify-center h-full px-4 py-3 border-b border-border last:border-b-0">
                <span className="text-sm font-bold text-muted uppercase tracking-wider">카테고리</span>
              </div>
            )}
            {allTags.length > 0 && (
              <div className="flex items-center justify-center h-full px-4 py-3 border-b border-border last:border-b-0">
                <span className="text-sm font-bold text-muted uppercase tracking-wider">태그</span>
              </div>
            )}
          </div>
          
          {/* Right Column: Content */}
          <div className="flex flex-col flex-1">
            {allCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-border last:border-b-0">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(selectedCategory === category ? null : category);
                      setSelectedIndex(-1);
                    }}
                    className={cn(
                       "px-2 py-1 text-sm rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                       selectedCategory === category
                         ? "text-accent font-bold"
                         : "text-muted hover:text-accent"
                     )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-border last:border-b-0">
                {allTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(selectedTag === tag ? null : tag);
                      setSelectedIndex(-1);
                    }}
                    className={cn(
                       "px-2 py-1 text-sm rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                       selectedTag === tag
                         ? "text-accent font-bold"
                         : "text-muted hover:text-accent"
                     )}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results List */}
        {(filteredPosts.length > 0 || query || hasActiveFilter) && (
          <div className="max-h-[50vh] overflow-y-auto py-2">
            {filteredPosts.length > 0 ? (
              <div className="flex flex-col">
                <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider">
                  게시물
                </div>
                {filteredPosts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onClick={onClose}
                    className={`flex flex-col gap-1 px-4 py-3 mx-2 rounded-lg transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      index === selectedIndex ? "bg-accent/10" : "hover:bg-muted/50"
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${index === selectedIndex ? "text-accent" : "text-foreground"}`}>
                        {post.title}
                      </span>
                      <span className="text-xs text-muted">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted line-clamp-1">
                      {post.description}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs text-muted/80">#{tag}</span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (query || hasActiveFilter) ? (
              <div className="px-4 py-8 text-center text-muted">
                <p>
                  {query ? `"${query}"에 대한 ` : ""}
                  {hasActiveFilter ? "해당 필터의 " : ""}
                  검색 결과가 없습니다.
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Footer */}
        {filteredPosts.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-background text-xs text-muted flex items-center justify-between">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted/10 dark:bg-muted/20 border border-border">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-muted/10 dark:bg-muted/20 border border-border">↓</kbd>
                <span>이동</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted/10 dark:bg-muted/20 border border-border">↵</kbd>
                <span>선택</span>
              </span>
            </div>
            <span>
              보이지 않는 결과는 <span className="font-semibold text-foreground">엔터</span>를 눌러 전체 검색
            </span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
