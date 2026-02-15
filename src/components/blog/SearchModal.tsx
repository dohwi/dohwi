"use client";

import Link from "next/link";
import { Search } from "lucide-react";
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
  } = useSearch({
    posts,
    isOpen,
    onClose,
  });

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Search className="w-5 h-5 text-muted shrink-0" />
          <input
            type="text"
            className="flex-1 h-14 px-3 bg-transparent text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent text-lg"
            placeholder="검색어를 입력하세요…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <Modal.Close />
        </Modal.Header>

        <FilterSection
          categories={allCategories}
          tags={allTags}
          selectedCategory={selectedCategory}
          selectedTag={selectedTag}
          onSelectCategory={setSelectedCategory}
          onSelectTag={setSelectedTag}
        />

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
                    "flex flex-col gap-1 px-4 py-3 mx-2 rounded-lg transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    index === selectedIndex ? "bg-accent/10" : "hover:bg-muted/50"
                  )}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "font-medium",
                        index === selectedIndex ? "text-accent" : "text-foreground"
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
          ) : query || hasActiveFilter ? (
            <div className="px-4 py-8 text-center text-muted">
              <p>
                {query ? `"${query}"에 대한 ` : ""}
                {hasActiveFilter ? "해당 필터의 " : ""}
                검색 결과가 없습니다.
              </p>
            </div>
          ) : null}
        </Modal.Body>

        {filteredPosts.length > 0 && (
          <Modal.Footer>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted/10 dark:bg-muted/20 border border-border">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-muted/10 dark:bg-muted/20 border border-border">
                  ↓
                </kbd>
                <span>이동</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted/10 dark:bg-muted/20 border border-border">
                  ↵
                </kbd>
                <span>선택</span>
              </span>
            </div>
            <span>
              보이지 않는 결과는{" "}
              <span className="font-semibold text-foreground">엔터</span>를 눌러 전체 검색
            </span>
          </Modal.Footer>
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
    <div className="flex border-b border-border">
      <div className="flex flex-col border-r border-border">
        {categories.length > 0 && (
          <div className="flex items-center justify-center h-full px-4 py-3 border-b border-border last:border-b-0">
            <span className="text-sm font-bold text-muted uppercase tracking-wider">카테고리</span>
          </div>
        )}
        {tags.length > 0 && (
          <div className="flex items-center justify-center h-full px-4 py-3 border-b border-border last:border-b-0">
            <span className="text-sm font-bold text-muted uppercase tracking-wider">태그</span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-border last:border-b-0">
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
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-border last:border-b-0">
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
        )}
      </div>
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
