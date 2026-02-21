"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Search } from "lucide-react";

import SearchModal from "@/components/blog/SearchModal";
import ThemeToggle from "@/components/common/ThemeToggle";
import type { PostMeta } from "@/types/post";

interface NavbarProps {
  posts: PostMeta[];
}

export default function Navbar({ posts }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <nav className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              <Image
                src="/logo.png"
                alt="dohwi.com 로고"
                width={32}
                height={32}
                sizes="32px"
                className="rounded-sm"
              />
              <span>도휘닷컴</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-2 rounded-md text-muted hover:text-foreground hover:bg-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="메인으로 이동"
            >
              <Home className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 flex items-center gap-2 rounded-md text-muted hover:text-foreground hover:bg-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="검색 (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>
            <ThemeToggle variant="ghost" />
          </div>
        </nav>
      </header>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
      />
    </>
  );
}
