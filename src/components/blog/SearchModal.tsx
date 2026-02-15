"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/common/Modal";
import { useSearch } from "@/hooks/useSearch";
import type { PostMeta } from "@/types/post";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: PostMeta[];
}

export default function SearchModal({ isOpen, onClose, posts }: SearchModalProps) {
  const {
    query,
    setQuery,
    selectedTag,
    setSelectedTag,
    selectedCategory,
    setSelectedCategory,
    selectedIndex,
    setSelectedIndex,
    filteredPosts,
    allTags,
    allCategories,
    hasActiveFilter,
    handleEnter,
  } = useSearch({
    posts,
    isOpen,
    onClose,
  });

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content className="relative">
        <Modal.Header className="px-0">
          <div className="flex-1 flex items-center px-6 group/input">
            <input
              type="text"
              className="flex-1 h-16 bg-transparent text-foreground placeholder:text-muted/50 focus:outline-none text-xl font-light tracking-tight"
              placeholder="무엇을 찾고 계신가요?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEnter();
              }}
              autoFocus
            />
            <button
              onClick={handleEnter}
              className={cn(
                "p-3 rounded-xl transition-all duration-300",
                query ? "text-accent bg-accent/10" : "text-muted hover:text-accent hover:bg-muted/10"
              )}
              title="검색"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </Modal.Header>

        <FilterSection
          categories={allCategories}
          tags={allTags}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          onSelectCategory={setSelectedCategory}
          onSelectTag={setSelectedTag}
        />

        {(filteredPosts.length > 0 || query || hasActiveFilter) && (
          <Modal.Body>
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
                    className={cn(
                      "flex flex-col gap-1 px-4 py-3 mx-2 rounded-lg transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:bg-accent/10 group",
                      index === selectedIndex && "bg-accent/5"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "font-medium transition-colors text-foreground group-hover:text-accent",
                          index === selectedIndex && "text-accent"
                        )}
                      >
                        {post.title}
                      </span>
                      <span className="text-xs text-muted">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted line-clamp-1">{post.description}</p>
                    <div className="flex gap-2 mt-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs text-muted/80">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-muted">
                <p>
                  {query ? `"${query}"에 대한 ` : ""}
                  {hasActiveFilter ? "해당 필터의 " : ""}
                  검색 결과가 없습니다.
                </p>
              </div>
            )}
          </Modal.Body>
        )}
      </Modal.Content>
    </Modal.Root>
  );
}

interface FilterSectionProps {
  categories: string[];
  tags: string[];
  selectedCategory: string | null;
  selectedTag: string | null;
  onSelectCategory: (category: string | null) => void;
  onSelectTag: (tag: string | null) => void;
}

function FilterSection({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onSelectCategory,
  onSelectTag,
}: FilterSectionProps) {
  if (categories.length === 0 && tags.length === 0) return null;

  return (
    <div className="flex flex-col border-b border-border">
      {categories.length > 0 && (
        <div className="flex border-b border-border last:border-b-0">
          <div className="w-20 sm:w-24 shrink-0 flex items-center justify-center border-r border-border bg-muted/5">
            <span className="text-[10px] sm:text-xs font-bold text-muted/80 uppercase tracking-widest">카테고리</span>
          </div>
          <div className="flex-1 flex flex-wrap gap-x-2 gap-y-1.5 px-4 py-3">
            {categories.map((category) => (
              <FilterButton
                key={category}
                isSelected={selectedCategory === category}
                onClick={() => onSelectCategory(selectedCategory === category ? null : category)}
              >
                {category}
              </FilterButton>
            ))}
          </div>
        </div>
      )}
      {tags.length > 0 && (
        <div className="flex border-b border-border last:border-b-0">
          <div className="w-20 sm:w-24 shrink-0 flex items-center justify-center border-r border-border bg-muted/5">
            <span className="text-[10px] sm:text-xs font-bold text-muted/80 uppercase tracking-widest">태그</span>
          </div>
          <div className="flex-1 flex flex-wrap gap-x-2 gap-y-1.5 px-4 py-3">
            {tags.slice(0, 10).map((tag) => (
              <FilterButton
                key={tag}
                isSelected={selectedTag === tag}
                onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
              >
                #{tag}
              </FilterButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterButtonProps {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

function FilterButton({ children, isSelected, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2 py-1 text-sm rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        isSelected ? "text-accent font-bold" : "text-muted hover:text-accent"
      )}
    >
      {children}
    </button>
  );
}
