"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 1. 표시 여부
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // 2. Footer와 겹침 방지 (끝까지 스크롤 시 위로 이동)
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      // 스크롤이 끝부분 (Footer 높이 부근)에 도달했는지 확인
      if (documentHeight - scrollPosition < 120) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    // 초기 상태 확인
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 w-full max-w-4xl pointer-events-none z-50 px-4 transition-all duration-300 ease-in-out",
        isAtBottom ? "bottom-20 sm:bottom-24" : "bottom-8"
      )}
    >
      <div className="flex justify-end">
        <button
          onClick={scrollToTop}
          className={cn(
            "p-2.5 rounded-full bg-background border border-border transition-all duration-300 ease-in-out pointer-events-auto hover:border-accent/50 hover:text-accent hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          )}
          aria-label="맨 위로 이동"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
